package com.kh.triptype.admin.pricing.service;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.triptype.admin.pricing.dao.AirlineDao;
import com.kh.triptype.admin.pricing.dao.FlightDao;
import com.kh.triptype.admin.pricing.dao.FlightOfferDao;
import com.kh.triptype.admin.pricing.dao.FlightPriceHistoryDao;
import com.kh.triptype.admin.pricing.dao.FlightSearchHistoryDao;
import com.kh.triptype.admin.pricing.model.dto.AmadeusFlightOfferDto;
import com.kh.triptype.admin.pricing.model.dto.AmadeusItineraryDto;
import com.kh.triptype.admin.pricing.model.dto.AmadeusSegmentDto;
import com.kh.triptype.admin.pricing.model.dto.FlightSearchRequestDto;
import com.kh.triptype.admin.pricing.model.dto.FlightSearchResponseDto;
import com.kh.triptype.admin.pricing.model.dto.FlightSegmentDto;
import com.kh.triptype.admin.pricing.model.dto.ParsedOfferDto;
import com.kh.triptype.admin.pricing.model.vo.FlightSearchCacheVo;
import com.kh.triptype.admin.pricing.model.vo.FlightSearchHistoryVo;
import com.kh.triptype.admin.pricing.model.vo.FlightVo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FlightSearchServiceImpl implements FlightSearchService {

    private final SqlSessionTemplate sqlSession;

    private final FlightSearchHistoryDao flightSearchHistoryDao;
    private final FlightPriceHistoryDao flightPriceHistoryDao;
    private final FlightOfferDao flightOfferDao;
    private final FlightDao flightDao;
    private final AirlineDao airlineDao;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${amadeus.api.key}")
    private String clientId;

    @Value("${amadeus.api.secret}")
    private String clientSecret;

    private static final String AMADEUS_TOKEN_URL =
            "https://test.api.amadeus.com/v1/security/oauth2/token";

    private static final String AMADEUS_FLIGHT_OFFERS_URL =
            "https://test.api.amadeus.com/v2/shopping/flight-offers";

    @Override
    @Transactional
    public FlightSearchResponseDto searchFlights(FlightSearchRequestDto request) {

        System.out.println("========== [SEARCH START] ==========");
        System.out.println("[REQ] " + request);

        validateRequest(request);

        /* 1️⃣ 검색 로그 */
        System.out.println("[STEP-1] insertSearchHistory START");

        int historyInserted =
                flightSearchHistoryDao.insertSearchHistory(
                        sqlSession,
                        FlightSearchHistoryVo.builder()
                                .searchLogOneWay("ONEWAY".equals(request.getTripType()) ? "Y" : "N")
                                .searchLogPassengerCount(
                                        safeInt(request.getAdultCount()) + safeInt(request.getMinorCount())
                                )
                                .searchLogDepartDate(
                                        request.getDepartDate() != null
                                                ? Date.valueOf(request.getDepartDate())
                                                : null
                                )
                                .searchLogReturnDate(
                                        request.getReturnDate() != null
                                                ? Date.valueOf(request.getReturnDate())
                                                : null
                                )
                                .departIataCode(request.getDepart())
                                .arriveIataCode(request.getArrive())
                                .memberNo(1L)
                                .build()
                );

        System.out.println("[STEP-1] insertSearchHistory END → result=" + historyInserted);

        /* 2️⃣ MULTI */
        if ("MULTI".equals(request.getTripType())) {
            System.out.println("[STEP-2] MULTI branch ENTER");
            return searchMultiFlights(request);
        }

        /* 3️⃣ 캐시 */
        System.out.println("[STEP-3] selectRecentSearchCache START");

        List<FlightSearchCacheVo> cached =
                flightPriceHistoryDao.selectRecentSearchCache(sqlSession, request);

        System.out.println("[STEP-3] cache size = " + (cached == null ? "null" : cached.size()));

        if (cached != null && !cached.isEmpty()) {
            System.out.println("[STEP-3] CACHE HIT → RETURN");
            return FlightSearchResponseDto.fromCache(cached);
        }

        /* 4️⃣ API */
        System.out.println("[STEP-4] issueAccessToken START");
        String token = issueAccessToken();
        System.out.println("[STEP-4] issueAccessToken END");

        System.out.println("[STEP-4] callSingleFlightApi START");
        List<AmadeusFlightOfferDto> offers =
                callSingleFlightApi(token, request);
        System.out.println("[STEP-4] offers size = " + (offers == null ? "null" : offers.size()));

        if (offers == null || offers.isEmpty()) {
            System.out.println("[STEP-4] offers EMPTY → RETURN");
            return FlightSearchResponseDto.fromCache(List.of());
        }

        /* 5️⃣ 저장 */
        System.out.println("[STEP-5] SAVE LOOP START");
        List<FlightSearchCacheVo> result = new ArrayList<>();

        int offerIdx = 0;
        for (AmadeusFlightOfferDto offer : offers) {

            offerIdx++;
            System.out.println("---- [OFFER #" + offerIdx + "] START");

            ParsedOfferDto parsed = parseOfferToFlights(offer);
            System.out.println("parsed flights size = " +
                    (parsed.getFlights() == null ? "null" : parsed.getFlights().size()));

            if (parsed.getFlights().isEmpty()) {
                System.out.println("parsed flights EMPTY → CONTINUE");
                continue;
            }

            Long offerId =
                    flightOfferDao.selectOfferIdBySegments(sqlSession, parsed.getFlights());

            System.out.println("selectOfferIdBySegments result = " + offerId);

            if (offerId == null) {

                System.out.println("offerId NULL → INSERT FLIGHT_OFFER");

                offerId =
                        flightOfferDao.insertFlightOfferAndReturnId(
                                sqlSession,
                                buildOfferInsertParam(request)
                        );

                System.out.println("insertFlightOfferAndReturnId offerId = " + offerId);

                for (FlightVo f : parsed.getFlights()) {
                    f.setFlightOfferId(offerId.intValue());
                }

                int flightInserted =
                        flightDao.insertFlights(sqlSession, parsed.getFlights());

                System.out.println("insertFlights result = " + flightInserted);
            }

            FlightSearchCacheVo cacheRow =
                    buildHistoryRowFromParsed(parsed, request, offerId);

            int cacheInserted =
                    flightPriceHistoryDao.insertSearchCache(sqlSession, cacheRow);

            System.out.println("insertSearchCache result = " + cacheInserted);

            result.add(cacheRow);
            System.out.println("---- [OFFER #" + offerIdx + "] END");
        }

        System.out.println("[STEP-5] SAVE LOOP END result.size=" + result.size());
        System.out.println("========== [SEARCH END] ==========");

        return FlightSearchResponseDto.fromCache(result);
    }

    /* ===================== MULTI ===================== */

    private FlightSearchResponseDto searchMultiFlights(FlightSearchRequestDto request) {

        System.out.println("========== [MULTI SEARCH START] ==========");

        String token = issueAccessToken();
        List<FlightSearchCacheVo> merged = new ArrayList<>();

        int legIdx = 0;
        for (FlightSegmentDto seg : request.getSegments()) {

            legIdx++;
            System.out.println("[MULTI LEG #" + legIdx + "] " + seg);

            FlightSearchRequestDto legReq = buildLegRequest(request, seg);

            List<FlightSearchCacheVo> cached =
                    flightPriceHistoryDao.selectRecentSearchCache(sqlSession, legReq);

            System.out.println("cache size = " + (cached == null ? "null" : cached.size()));

            if (cached != null && !cached.isEmpty()) {
                merged.addAll(cached);
                continue;
            }

            List<AmadeusFlightOfferDto> offers =
                    callSingleFlightApi(token, legReq);

            System.out.println("offers size = " + offers.size());

            for (AmadeusFlightOfferDto offer : offers) {

                ParsedOfferDto parsed = parseOfferToFlights(offer);
                if (parsed.getFlights().isEmpty()) continue;

                Long offerId =
                        flightOfferDao.selectOfferIdBySegments(sqlSession, parsed.getFlights());

                if (offerId == null) {

                    offerId =
                            flightOfferDao.insertFlightOfferAndReturnId(
                                    sqlSession,
                                    buildOfferInsertParam(legReq)
                            );

                    for (FlightVo f : parsed.getFlights()) {
                        f.setFlightOfferId(offerId.intValue());
                    }

                    flightDao.insertFlights(sqlSession, parsed.getFlights());
                }

                FlightSearchCacheVo cacheRow =
                        buildHistoryRowFromParsed(parsed, legReq, offerId);

                flightPriceHistoryDao.insertSearchCache(sqlSession, cacheRow);
                merged.add(cacheRow);
            }
        }

        System.out.println("========== [MULTI SEARCH END] ==========");
        return FlightSearchResponseDto.fromCache(merged);
    }

    /* ===================== API ===================== */

    private String issueAccessToken() {
        try {
            System.out.println("[TOKEN] REQUEST");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            var body = new org.springframework.util.LinkedMultiValueMap<String, String>();
            body.add("grant_type", "client_credentials");
            body.add("client_id", clientId);
            body.add("client_secret", clientSecret);

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(
                            AMADEUS_TOKEN_URL,
                            new HttpEntity<>(body, headers),
                            Map.class
                    );

            System.out.println("[TOKEN] RESPONSE " + response.getBody());
            return String.valueOf(response.getBody().get("access_token"));

        } catch (RestClientException e) {
            throw new IllegalStateException("AccessToken 발급 실패", e);
        }
    }

    private List<AmadeusFlightOfferDto> callSingleFlightApi(
            String accessToken,
            FlightSearchRequestDto request) {

        System.out.println("[API] CALL " + request.getDepart() + " → " + request.getArrive());

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        UriComponentsBuilder uri =
                UriComponentsBuilder.fromUriString(AMADEUS_FLIGHT_OFFERS_URL)
                        .queryParam("originLocationCode", request.getDepart())
                        .queryParam("destinationLocationCode", request.getArrive())
                        .queryParam("departureDate", request.getDepartDate())
                        .queryParam("adults", request.getAdultCount())
                        .queryParam("max", 20);   // 🔥 핵심;

        if ("ROUND".equals(request.getTripType())) {
            uri.queryParam("returnDate", request.getReturnDate());
        }

        ResponseEntity<Map> response =
                restTemplate.exchange(
                        uri.toUriString(),
                        HttpMethod.GET,
                        new HttpEntity<>(headers),
                        Map.class
                );
      
        System.out.println("[API] RESPONSE BODY KEYS = " + response.getBody().keySet());

        return objectMapper.convertValue(
                response.getBody().get("data"),
                new TypeReference<List<AmadeusFlightOfferDto>>() {}
        );
    }

    /* ===================== 파싱 ===================== */

    private ParsedOfferDto parseOfferToFlights(AmadeusFlightOfferDto offer) {

        List<FlightVo> flights = new ArrayList<>();
        int dirIdx = 0;
        
        
        for (AmadeusItineraryDto iti : offer.getItineraries()) {

            String direction = (dirIdx++ == 0) ? "O" : "I";
            int segNo = 1;

            for (AmadeusSegmentDto seg : iti.getSegments()) {

                Integer airlineId =
                        airlineDao.selectAirlineIdByIataCode(
                                sqlSession,
                                seg.getCarrierCode()
                        );

                flights.add(
                        FlightVo.builder()
                                .flightSegmentNo(segNo++)
                                .flightNumber(seg.getCarrierCode() + seg.getNumber())
                                .flightDepartDate(
                                       //Date.valueOf(seg.getDeparture().getAt().substring(0, 10))
                                		LocalDateTime.parse(seg.getDeparture().getAt())
                                )
                                .flightArriveDate(
                                        //Date.valueOf(seg.getArrival().getAt().substring(0, 10))

                                		LocalDateTime.parse(seg.getArrival().getAt()))

                                .flightDuration(seg.getDuration())
                                .flightDirection(direction)
                                .departAirport(seg.getDeparture().getIataCode())
                                .destAirport(seg.getArrival().getIataCode())
                                .operAirlineId(airlineId)
                                .sellingAirlineId(airlineId)
                                .build()
                    
                              
                );
            }
        }

        return ParsedOfferDto.builder()
                .flights(flights)
                .totalPrice(new BigDecimal(offer.getPrice().getTotal()))
                .currency(offer.getPrice().getCurrency())
                .build();
    }

    /* ===================== util ===================== */

    private FlightSearchRequestDto buildLegRequest(
            FlightSearchRequestDto origin,
            FlightSegmentDto seg) {

        FlightSearchRequestDto leg = new FlightSearchRequestDto();
        leg.setTripType("ONEWAY");
        leg.setDepart(seg.getDepart());
        leg.setArrive(seg.getArrive());
        leg.setDepartDate(seg.getDate());
        leg.setAdultCount(origin.getAdultCount());
        leg.setMinorCount(origin.getMinorCount());
        return leg;
    }

    private Map<String, Object> buildOfferInsertParam(FlightSearchRequestDto request) {
        Map<String, Object> p = new java.util.LinkedHashMap<>();
        p.put("oneWay", "ONEWAY".equals(request.getTripType()) ? "Y" : "N");
        p.put("departDate", Date.valueOf(request.getDepartDate()));
        p.put(
                "returnDate",
                request.getReturnDate() != null
                        ? Date.valueOf(request.getReturnDate())
                        : null
        );
        p.put("depDurTotal", 0);
        p.put("retDurTotal", null);
        p.put("extraSeat", 0);
        p.put("isDel", "N");
        p.put("airlineId", 1);
        return p;
    }

    private FlightSearchCacheVo buildHistoryRowFromParsed(
            ParsedOfferDto parsed,
            FlightSearchRequestDto request,
            Long offerId) {

        return FlightSearchCacheVo.builder()
                .flightOfferId(offerId)
                .flightOfferPriceTotal(parsed.getTotalPrice())
                .flightOfferCurrency(parsed.getCurrency())
                .flightOfferOneWay("ONEWAY".equals(request.getTripType()) ? "Y" : "N")
                .flightOfferDepartDate(Date.valueOf(request.getDepartDate()))
                .flightOfferReturnDate(
                        request.getReturnDate() != null
                                ? Date.valueOf(request.getReturnDate())
                                : null
                )
                .flightOfferApiQueryDate(new Date(System.currentTimeMillis()))
                .departIataCode(request.getDepart())
                .arriveIataCode(request.getArrive())
                .airlineId(1)
                .build();
    }

    private void validateRequest(FlightSearchRequestDto request) {
        if (request == null || request.getTripType() == null) {
            throw new IllegalArgumentException("Invalid request");
        }
    }

    private int safeInt(Integer v) {
        return v == null ? 0 : v;
    }
}

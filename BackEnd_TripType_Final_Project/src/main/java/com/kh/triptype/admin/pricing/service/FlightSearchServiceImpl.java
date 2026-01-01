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
import org.springframework.transaction.support.TransactionTemplate;
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
    private final TransactionTemplate transactionTemplate;

    private final FlightSearchHistoryDao flightSearchHistoryDao;
    private final FlightPriceHistoryDao flightPriceHistoryDao;
    private final FlightOfferDao flightOfferDao;
    private final FlightDao flightDao;
    private final AirlineDao airlineDao;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final Map<String, Integer> airlineCache =
            new java.util.concurrent.ConcurrentHashMap<>();

    @Value("${amadeus.api.key}")
    private String clientId;

    @Value("${amadeus.api.secret}")
    private String clientSecret;

    private static final String AMADEUS_TOKEN_URL =
            "https://test.api.amadeus.com/v1/security/oauth2/token";

    private static final String AMADEUS_FLIGHT_OFFERS_URL =
            "https://test.api.amadeus.com/v2/shopping/flight-offers";

    @Override
    public FlightSearchResponseDto searchFlights(FlightSearchRequestDto request) {

        System.out.println("========== [SEARCH START] ==========");
        System.out.println("[REQ] " + request);

        validateRequest(request);

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

        if ("MULTI".equals(request.getTripType())) {
            return searchMultiFlights(request);
        }

        List<FlightSearchCacheVo> cached =
                flightPriceHistoryDao.selectRecentSearchCache(sqlSession, request);

        if (cached != null && !cached.isEmpty()) {
            return FlightSearchResponseDto.fromCache(cached);
        }

        String token = issueAccessToken();
        List<AmadeusFlightOfferDto> offers =
                callSingleFlightApi(token, request);

        if (offers == null || offers.isEmpty()) {
            return FlightSearchResponseDto.fromCache(List.of());
        }

        List<FlightSearchCacheVo> result = new ArrayList<>();

        int offerIdx = 0;
        for (AmadeusFlightOfferDto offer : offers) {

            offerIdx++;
            ParsedOfferDto parsed = parseOfferToFlights(offer);
            if (parsed.getFlights().isEmpty()) continue;

            try {
                FlightSearchCacheVo saved =
                        transactionTemplate.execute(status -> {

                            Long offerId =
                                    flightOfferDao.selectOfferIdBySegments(
                                            sqlSession, parsed.getFlights()
                                    );

                            if (offerId == null) {
                                offerId =
                                        flightOfferDao.insertFlightOfferAndReturnId(
                                                sqlSession,
                                                buildOfferInsertParam(request)
                                        );

                                for (FlightVo f : parsed.getFlights()) {
                                    f.setFlightOfferId(offerId.intValue());
                                    if (f.getDepartAirport() != null)
                                        f.setDepartAirport(f.getDepartAirport().trim().toUpperCase());
                                    if (f.getDestAirport() != null)
                                        f.setDestAirport(f.getDestAirport().trim().toUpperCase());
                                }

                                flightDao.insertFlights(sqlSession, parsed.getFlights());
                            }

                            FlightSearchCacheVo cacheRow =
                                    buildHistoryRowFromParsed(parsed, request, offerId);

                            flightPriceHistoryDao.insertSearchCache(
                                    sqlSession, cacheRow
                            );

                            return cacheRow;
                        });

                if (saved != null) {
                    result.add(saved);
                }

            } catch (Exception e) {
                System.out.println(
                        "[ROLLBACK OFFER #" + offerIdx + "] " + e.getMessage()
                );
            }
        }

        System.out.println("========== [SEARCH END] ==========");
        return FlightSearchResponseDto.fromCache(result);
    }

    /* ===================== MULTI ===================== */

    private FlightSearchResponseDto searchMultiFlights(FlightSearchRequestDto request) {

        String token = issueAccessToken();
        List<FlightSearchCacheVo> merged = new ArrayList<>();

        for (FlightSegmentDto seg : request.getSegments()) {

            FlightSearchRequestDto legReq = buildLegRequest(request, seg);

            List<FlightSearchCacheVo> cached =
                    flightPriceHistoryDao.selectRecentSearchCache(sqlSession, legReq);

            if (cached != null && !cached.isEmpty()) {
                merged.addAll(cached);
                continue;
            }

            List<AmadeusFlightOfferDto> offers =
                    callSingleFlightApi(token, legReq);

            for (AmadeusFlightOfferDto offer : offers) {

                ParsedOfferDto parsed = parseOfferToFlights(offer);
                if (parsed.getFlights().isEmpty()) continue;

                try {
                    FlightSearchCacheVo saved =
                            transactionTemplate.execute(status -> {

                                Long offerId =
                                        flightOfferDao.selectOfferIdBySegments(
                                                sqlSession, parsed.getFlights()
                                        );

                                if (offerId == null) {
                                    offerId =
                                            flightOfferDao.insertFlightOfferAndReturnId(
                                                    sqlSession,
                                                    buildOfferInsertParam(legReq)
                                            );

                                    for (FlightVo f : parsed.getFlights()) {
                                        f.setFlightOfferId(offerId.intValue());
                                        if (f.getDepartAirport() != null)
                                            f.setDepartAirport(f.getDepartAirport().trim().toUpperCase());
                                        if (f.getDestAirport() != null)
                                            f.setDestAirport(f.getDestAirport().trim().toUpperCase());
                                    }

                                    flightDao.insertFlights(sqlSession, parsed.getFlights());
                                }

                                FlightSearchCacheVo cacheRow =
                                        buildHistoryRowFromParsed(parsed, legReq, offerId);

                                flightPriceHistoryDao.insertSearchCache(
                                        sqlSession, cacheRow
                                );

                                return cacheRow;
                            });

                    if (saved != null) merged.add(saved);

                } catch (Exception e) {
                    System.out.println("[MULTI ROLLBACK] " + e.getMessage());
                }
            }
        }

        return FlightSearchResponseDto.fromCache(merged);
    }

    /* ===================== API ===================== */

    private String issueAccessToken() {
        try {
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

            return String.valueOf(response.getBody().get("access_token"));

        } catch (RestClientException e) {
            throw new IllegalStateException("AccessToken 발급 실패", e);
        }
    }

    private List<AmadeusFlightOfferDto> callSingleFlightApi(
            String accessToken,
            FlightSearchRequestDto request) {

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        UriComponentsBuilder uri =
                UriComponentsBuilder.fromUriString(AMADEUS_FLIGHT_OFFERS_URL)
                        .queryParam("originLocationCode", request.getDepart())
                        .queryParam("destinationLocationCode", request.getArrive())
                        .queryParam("departureDate", request.getDepartDate())
                        .queryParam("adults", request.getAdultCount())
                        .queryParam("max", 20);

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

        return objectMapper.convertValue(
                response.getBody().get("data"),
                new TypeReference<List<AmadeusFlightOfferDto>>() {}
        );
    }

    /* ===================== 파싱 / util ===================== */

    private ParsedOfferDto parseOfferToFlights(AmadeusFlightOfferDto offer) {

        List<FlightVo> flights = new ArrayList<>();
        int dirIdx = 0;

        for (AmadeusItineraryDto iti : offer.getItineraries()) {

            String direction = (dirIdx++ == 0) ? "O" : "I";
            int segNo = 1;

            for (AmadeusSegmentDto seg : iti.getSegments()) {

                Integer airlineId =
                        airlineCache.computeIfAbsent(
                                seg.getCarrierCode(),
                                code -> airlineDao.selectAirlineIdByIataCode(sqlSession, code)
                        );

                flights.add(
                        FlightVo.builder()
                                .flightSegmentNo(segNo++)
                                .flightNumber(seg.getCarrierCode() + seg.getNumber())
                                .flightDepartDate(LocalDateTime.parse(seg.getDeparture().getAt()))
                                .flightArriveDate(LocalDateTime.parse(seg.getArrival().getAt()))
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
        p.put("returnDate",
                request.getReturnDate() != null
                        ? Date.valueOf(request.getReturnDate())
                        : null);
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

package com.kh.triptype.admin.pricing.service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.kh.triptype.admin.pricing.dao.FlightPriceHistoryDao;
import com.kh.triptype.admin.pricing.dao.FlightSearchHistoryDao;
import com.kh.triptype.admin.pricing.model.dto.FlightSearchRequestDto;
import com.kh.triptype.admin.pricing.model.dto.FlightSearchResponseDto;
import com.kh.triptype.admin.pricing.model.dto.FlightSegmentDto;
import com.kh.triptype.admin.pricing.model.vo.FlightPriceHistoryVo;
import com.kh.triptype.admin.pricing.model.vo.FlightSearchHistoryVo;

import lombok.RequiredArgsConstructor;

/**
 * 항공권 검색 서비스 구현체
 */
@Service
@RequiredArgsConstructor
public class FlightSearchServiceImpl implements FlightSearchService {

    private final FlightPriceHistoryDao flightPriceHistoryDao;
    private final FlightSearchHistoryDao flightSearchHistoryDao;
    private final SqlSessionTemplate sqlSession;

    private final RestTemplate restTemplate = new RestTemplate();

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

        validateRequest(request);

        /* ===============================
           1️⃣ 검색 기록 저장
           =============================== */
        FlightSearchHistoryVo historyVo = FlightSearchHistoryVo.builder()
                .searchLogOneWay("ONEWAY".equals(request.getTripType()) ? "Y" : "N")
                .searchLogPassengerCount(
                        request.getAdultCount() + request.getMinorCount()
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
                .memberNo(0)
                .build();

        flightSearchHistoryDao.insertSearchHistory(sqlSession, historyVo);

        /* ===============================
           2️⃣ MULTI
           =============================== */
        if ("MULTI".equals(request.getTripType())) {
            return searchMultiFlights(request);
        }

        /* ===============================
           3️⃣ 캐시 조회
           =============================== */
        List<FlightPriceHistoryVo> cachedList =
                flightPriceHistoryDao.selectRecentPriceHistory(sqlSession, request);

        if (cachedList != null && !cachedList.isEmpty()) {
            return FlightSearchResponseDto.from(cachedList);
        }

        /* ===============================
           4️⃣ 외부 API 호출
           =============================== */
        String accessToken = issueAccessToken();

        List<Map<String, Object>> apiData =
                callSingleFlightApi(accessToken, request);

        List<FlightPriceHistoryVo> apiResultList =
                convertToPriceHistory(apiData, request);

        /* ===============================
           5️⃣ 가격 히스토리 저장
           =============================== */
        for (FlightPriceHistoryVo vo : apiResultList) {
            flightPriceHistoryDao.insertFlightPriceHistory(sqlSession, vo);
        }

        return FlightSearchResponseDto.from(apiResultList);
    }

    /* =====================================================
       🔹 MULTI
       ===================================================== */
    private FlightSearchResponseDto searchMultiFlights(
            FlightSearchRequestDto request) {

        String accessToken = issueAccessToken();
        List<Map<String, Object>> apiData =
                callMultiFlightApi(accessToken, request);

        return FlightSearchResponseDto.fromApi(apiData);
    }

    /* =====================================================
       🔹 Access Token
       ===================================================== */
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

            return (String) response.getBody().get("access_token");

        } catch (RestClientException e) {
            // ✅ 여기서 RestClientException 사용
            throw new IllegalStateException("Amadeus AccessToken 발급 실패", e);
        }
    }


    /* =====================================================
       🔹 단일 여정 API
       ===================================================== */
    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> callSingleFlightApi(
            String accessToken,
            FlightSearchRequestDto request) {

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        UriComponentsBuilder uri =
                UriComponentsBuilder
                		.fromUriString(AMADEUS_FLIGHT_OFFERS_URL)
                        .queryParam("originLocationCode", request.getDepart())
                        .queryParam("destinationLocationCode", request.getArrive())
                        .queryParam("departureDate", request.getDepartDate())
                        .queryParam("adults", request.getAdultCount());

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

        return (List<Map<String, Object>>) response.getBody().get("data");
    }

    /* =====================================================
       🔹 MULTI API
       ===================================================== */
    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> callMultiFlightApi(
            String accessToken,
            FlightSearchRequestDto request) {

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = buildMultiRequestBody(request);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        AMADEUS_FLIGHT_OFFERS_URL,
                        new HttpEntity<>(body, headers),
                        Map.class
                );

        return (List<Map<String, Object>>) response.getBody().get("data");
    }

    /* =====================================================
       🔹 MULTI Body
       ===================================================== */
    private Map<String, Object> buildMultiRequestBody(
            FlightSearchRequestDto request) {

        List<FlightSegmentDto> segments = request.getSegments();
        if (segments == null || segments.isEmpty()) {
            throw new IllegalArgumentException("MULTI requires segments");
        }

        List<Map<String, Object>> originDestinations = new ArrayList<>();
        int idx = 1;

        for (FlightSegmentDto seg : segments) {

            Map<String, Object> dateRange = new LinkedHashMap<>();
            dateRange.put("date", seg.getDate());

            Map<String, Object> od = new LinkedHashMap<>();
            od.put("id", String.valueOf(idx++));
            od.put("originLocationCode", seg.getDepart());
            od.put("destinationLocationCode", seg.getArrive());
            od.put("departureDateTimeRange", dateRange);

            originDestinations.add(od);
        }

        List<Map<String, Object>> travelers = List.of(
                Map.of("id", "1", "travelerType", "ADULT")
        );

        return Map.of(
                "originDestinations", originDestinations,
                "travelers", travelers,
                "sources", List.of("GDS")
        );
    }

    /* =====================================================
       🔹 API → VO
       ===================================================== */
    private List<FlightPriceHistoryVo> convertToPriceHistory(
            List<Map<String, Object>> apiData,
            FlightSearchRequestDto request) {

        List<FlightPriceHistoryVo> result = new ArrayList<>();

        for (Map<String, Object> item : apiData) {

            Map<?, ?> price = (Map<?, ?>) item.get("price");

            result.add(
                FlightPriceHistoryVo.builder()
                    .flightOfferPriceTotal(String.valueOf(price.get("total")))
                    .flightOfferCurrency(String.valueOf(price.get("currency")))
                    .flightOfferOneWay(
                        "ONEWAY".equals(request.getTripType()) ? "Y" : "N"
                    )
                    .flightOfferDepartDate(
                        Date.valueOf(request.getDepartDate())
                    )
                    .flightOfferReturnDate(
                        request.getReturnDate() != null
                            ? Date.valueOf(request.getReturnDate())
                            : null
                    )
                    .flightOfferApiQueryDate(
                        Date.valueOf(LocalDate.now())
                    )
                    .airlineId(0)
                    .build()
            );
        }

        return result;
    }

    /* =====================================================
       🔹 검증
       ===================================================== */
    private void validateRequest(FlightSearchRequestDto request) {
        if (request == null || request.getTripType() == null) {
            throw new IllegalArgumentException("Invalid request");
        }
    }
}

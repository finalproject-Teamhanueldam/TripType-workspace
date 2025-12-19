package com.kh.triptype.admin.pricing.service;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.kh.triptype.admin.pricing.dao.FlightPriceHistoryDao;
import com.kh.triptype.admin.pricing.dao.FlightSearchHistoryDao;
import com.kh.triptype.admin.pricing.model.dto.FlightSearchRequestDto;
import com.kh.triptype.admin.pricing.model.dto.FlightSearchResponseDto;
import com.kh.triptype.admin.pricing.model.dto.FlightSegmentDto;
import com.kh.triptype.admin.pricing.model.vo.FlightSearchCacheVo;
import com.kh.triptype.admin.pricing.model.vo.FlightSearchHistoryVo;

import lombok.RequiredArgsConstructor;

/**
 * 항공권 검색 서비스 구현체
 */
@Profile("!prod")
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
        System.out.println("🔥 [1] searchFlights 진입");

        validateRequest(request);

        /* ===============================
           1️⃣ 검색 기록 저장
           =============================== */

        // 🔥 임시 하드코딩 회원 번호
        Long memberNo = 1L;

        FlightSearchHistoryVo historyVo =
                FlightSearchHistoryVo.builder()
                        .searchLogOneWay(
                                "ONEWAY".equals(request.getTripType()) ? "Y" : "N"
                        )
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
                        .memberNo(memberNo)
                        .build();

        flightSearchHistoryDao.insertSearchHistory(sqlSession, historyVo);
        System.out.println("📝 검색 로그 저장 완료: " + historyVo);

        /* ===============================
           2️⃣ MULTI 검색
           =============================== */
        if ("MULTI".equals(request.getTripType())) {
            return searchMultiFlights(request);
        }

        /* ===============================
           3️⃣ 1시간 캐시 조회 (TB_FLIGHT_PRICE_HISTORY)
           =============================== */
        List<FlightSearchCacheVo> cachedList =
                flightPriceHistoryDao.selectRecentSearchCache(sqlSession, request);

        System.out.println(
                "cachedList size = " + (cachedList == null ? "null" : cachedList.size())
        );

        if (cachedList != null && !cachedList.isEmpty()) {
            System.out.println("⚡ 캐시 HIT → API 호출 안 함");
            return FlightSearchResponseDto.fromCache(cachedList);
        }

        /* ===============================
           4️⃣ 외부 API 호출
           =============================== */
        String accessToken = issueAccessToken();
        System.out.println("🌐 캐시 MISS → 외부 API 호출");

        List<Map<String, Object>> apiData =
                callSingleFlightApi(accessToken, request);

        System.out.println("🌐 API 응답 건수 = " + (apiData == null ? 0 : apiData.size()));

        /* ===============================
           5️⃣ API → 캐시 VO 변환
           =============================== */
        List<FlightSearchCacheVo> cacheVoList =
                convertToSearchCache(apiData, request);

        /* ===============================
           6️⃣ 캐시 저장
           =============================== */
        for (FlightSearchCacheVo vo : cacheVoList) {
            System.out.println("💾 캐시 저장: " + vo.getFlightOfferPriceTotal());
            flightPriceHistoryDao.insertSearchCache(sqlSession, vo);
        }

        return FlightSearchResponseDto.fromCache(cacheVoList);
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

            var body =
                    new org.springframework.util.LinkedMultiValueMap<String, String>();
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

        List<Map<String, Object>> travelers =
                List.of(Map.of("id", "1", "travelerType", "ADULT"));

        return Map.of(
                "originDestinations", originDestinations,
                "travelers", travelers,
                "sources", List.of("GDS")
        );
    }

    /* =====================================================
       🔹 API → 캐시 VO
       ===================================================== */
    private List<FlightSearchCacheVo> convertToSearchCache(
            List<Map<String, Object>> apiData,
            FlightSearchRequestDto request) {

        List<FlightSearchCacheVo> result = new ArrayList<>();

        if (apiData == null) {
            return result;
        }

        for (Map<String, Object> item : apiData) {

            Map<?, ?> price = (Map<?, ?>) item.get("price");

            result.add(
                    FlightSearchCacheVo.builder()
                            .flightOfferId(0)
                            .flightOfferPriceTotal(
                            	    new BigDecimal(String.valueOf(price.get("total")))
                            )
                            .flightOfferCurrency(
                                    String.valueOf(price.get("currency"))
                            )
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
                            .departIataCode(request.getDepart())
                            .arriveIataCode(request.getArrive())
                            .airlineId(null)
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

package com.kh.triptype.admin.pricing.service;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

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
import com.kh.triptype.airline.model.service.AirlineListService;
import com.kh.triptype.airline.model.vo.AirlineListVo;

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

    /* =========================================================
    ✅✅ [추가] 캐시 HIT 시 AirlineListVo를 DB에서 조회해서 반환하기 위해 주입
    - 기존 AirlineListController가 사용하던 서비스 재사용
    - 다른 코드 영향 최소 + “같은 필터 재검색 empty” 즉시 해결
    ========================================================= */
    private final AirlineListService airlineListService;

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

    /* =========================================================
       ✅ 추가: 비동기 검색 잡 관리 (즉시 응답용)
       - 컨트롤러가 searchId만 즉시 받고, 목록 페이지에서 결과 조회하는 구조에 필요
       - 기존 searchFlights/searchFlightsForList는 그대로 유지 (다른 코드 영향 최소)
       ========================================================= */
    private enum JobStatus { PENDING, DONE, ERROR }

    private static class SearchJob {
        volatile JobStatus status = JobStatus.PENDING;
        volatile List<AirlineListVo> result;
        volatile String errorMessage;
        final long createdAt = System.currentTimeMillis();
    }

    // searchId -> job
    private final Map<String, SearchJob> jobStore = new ConcurrentHashMap<>();

    /**
     * ✅ 신규: 검색을 "백그라운드"에서 수행하도록 시작하고, 즉시 searchId 반환
     * - 기존 로직은 그대로 재사용 (searchFlightsForList 실행)
     */
    @Override
    public String startSearchAsync(FlightSearchRequestDto request) {

        validateRequest(request);

        // searchId 생성
        String searchId = UUID.randomUUID().toString();
        SearchJob job = new SearchJob();
        jobStore.put(searchId, job);

        // 백그라운드 실행 (Spring @Async 없이도 동작)
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                List<AirlineListVo> list = searchFlightsForList(request);
                job.result = (list == null) ? new ArrayList<>() : list;
                job.status = JobStatus.DONE;
            } catch (Exception e) {
                job.errorMessage = e.getMessage();
                job.status = JobStatus.ERROR;
                e.printStackTrace();
            }
        });

        // 오래된 job 정리 (간단 정리: 30분 초과 삭제)
        cleanupOldJobs(30 * 60 * 1000L);

        return searchId;
    }

    /**
     * ✅ 신규: searchId로 결과 조회
     * - 아직 준비 안 됐으면 null 반환 (컨트롤러에서 202로 처리)
     * - 에러면 IllegalStateException 던짐
     *
     * ✅✅ [수정 핵심]
     * - jobStore에 searchId가 없을 때(서버 재시작/만료/유실 등)
     *   IllegalArgumentException을 던지면 프론트 폴링이 "에러"로 끊김
     * - 여기서는 "PENDING(null)"로 처리해서 컨트롤러가 202를 내려주게 함
     */
    @Override
    public List<AirlineListVo> getSearchResult(String searchId) {

        SearchJob job = jobStore.get(searchId);

        // ✅✅ [수정] invalid라도 예외 던지지 말고 PENDING 취급
        if (job == null) {
            return null; // 컨트롤러가 202(PENDING)로 응답하게 됨
        }

        if (job.status == JobStatus.PENDING) {
            return null; // 아직 준비 안 됨
        }

        if (job.status == JobStatus.ERROR) {
            throw new IllegalStateException("Search failed: " + job.errorMessage);
        }

        return job.result == null ? new ArrayList<>() : job.result;
    }

    private void cleanupOldJobs(long ttlMillis) {
        long now = System.currentTimeMillis();
        jobStore.entrySet().removeIf(e -> (now - e.getValue().createdAt) > ttlMillis);
    }

    /* =========================================================
       ✅✅ memberNo 안전 처리 유틸
       ========================================================= */
    private Long resolveMemberNo(FlightSearchRequestDto request) {
        if (request == null) return null;
        return request.getMemberNo();
    }

    /* =========================================================
       ✅✅ 대표 airlineId 결정
       ========================================================= */
    private int resolveRepresentativeAirlineId(List<FlightVo> flights) {
        if (flights == null || flights.isEmpty()) return 1;

        for (FlightVo f : flights) {
            if (f != null && f.getSellingAirlineId() != null) {
                return f.getSellingAirlineId();
            }
        }
        for (FlightVo f : flights) {
            if (f != null && f.getOperAirlineId() != null) {
                return f.getOperAirlineId();
            }
        }
        return 1;
    }

    @Override
    public FlightSearchResponseDto searchFlights(FlightSearchRequestDto request) {

        System.out.println("========== [SEARCH START] ==========");
        System.out.println("[REQ] " + request);

        validateRequest(request);

        Long memberNo = resolveMemberNo(request);

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
                        .memberNo(memberNo)
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

            int repAirlineId = resolveRepresentativeAirlineId(parsed.getFlights());

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
                                                buildOfferInsertParam(request, repAirlineId)
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
                                    buildHistoryRowFromParsed(parsed, request, offerId, repAirlineId);

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

    @Override
    public List<AirlineListVo> searchFlightsForList(FlightSearchRequestDto request) {

        System.out.println("========== [SEARCH_FOR_LIST START] ==========");
        System.out.println("[REQ] " + request);

        validateRequest(request);

        Long memberNo = resolveMemberNo(request);

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
                        .memberNo(memberNo)
                        .build()
        );

        if ("MULTI".equals(request.getTripType())) {
            System.out.println("⚠️ MULTI 요청: 현재 searchFlightsForList는 단일/왕복 렌더 기준");
            try {
                searchFlights(request);
            } catch (Exception e) {
                System.out.println("❌ MULTI fallback(searchFlights) 실패: " + e.getMessage());
            }
            return new ArrayList<>();
        }

        List<FlightSearchCacheVo> cached =
                flightPriceHistoryDao.selectRecentSearchCache(sqlSession, request);

        if (cached != null && !cached.isEmpty()) {

            System.out.println("✅ 1시간 캐시 HIT: count=" + cached.size() + " -> DB에서 목록 재조회 후 반환");

            com.kh.triptype.airline.model.vo.AirlineFilter filter =
                    new com.kh.triptype.airline.model.vo.AirlineFilter();

            filter.setDepart(request.getDepart());
            filter.setArrive(request.getArrive());
            filter.setDepartDate(request.getDepartDate());
            filter.setReturnDate(request.getReturnDate());
            filter.setAdultCount(request.getAdultCount());
            filter.setMinorCount(request.getMinorCount());

            if ("ROUND".equals(request.getTripType())) {
                filter.setTripType("N");
            } else if ("ONEWAY".equals(request.getTripType())) {
                filter.setTripType("Y");
            } else {
                filter.setTripType(request.getTripType());
            }

            filter.setSortType("PRICE");

            ArrayList<AirlineListVo> list =
                    airlineListService.selectAirlineListPrice(filter);

            if (list == null) return new ArrayList<>();
            return list;
        }

        String token = issueAccessToken();
        List<AmadeusFlightOfferDto> offers = callSingleFlightApi(token, request);

        if (offers == null || offers.isEmpty()) {
            System.out.println("✅ API 결과 없음");
            return new ArrayList<>();
        }

        List<AirlineListVo> renderList = new ArrayList<>();

        int offerIdx = 0;
        for (AmadeusFlightOfferDto offer : offers) {

            offerIdx++;
            ParsedOfferDto parsed = parseOfferToFlights(offer);
            if (parsed.getFlights().isEmpty()) continue;

            int repAirlineId = resolveRepresentativeAirlineId(parsed.getFlights());

            try {
                Long offerId = transactionTemplate.execute(status -> {

                    Long id =
                            flightOfferDao.selectOfferIdBySegments(
                                    sqlSession, parsed.getFlights()
                            );

                    if (id == null) {
                        id = flightOfferDao.insertFlightOfferAndReturnId(
                                sqlSession,
                                buildOfferInsertParam(request, repAirlineId)
                        );
                    }

                    return id;
                });

                if (offerId == null) continue;

                for (FlightVo f : parsed.getFlights()) {
                    f.setFlightOfferId(offerId.intValue());
                    if (f.getDepartAirport() != null)
                        f.setDepartAirport(f.getDepartAirport().trim().toUpperCase());
                    if (f.getDestAirport() != null)
                        f.setDestAirport(f.getDestAirport().trim().toUpperCase());
                }

                renderList.addAll(toAirlineListRows(parsed.getFlights(), parsed, request));

                try {
                    transactionTemplate.execute(status -> null);
                } catch (Exception ignore) {
                    // no-op
                }

            } catch (Exception e) {
                System.out.println("[SEARCH_FOR_LIST OFFER #" + offerIdx + " ERROR] " + e.getMessage());
            }
        }

        try {
            System.out.println("👉 DB 적재(searchFlights) 시작");
            searchFlights(request);
            System.out.println("👉 DB 적재(searchFlights) 완료");
        } catch (Exception e) {
            System.out.println("❌ DB 적재(searchFlights) 실패: " + e.getMessage());
        }

        System.out.println("========== [SEARCH_FOR_LIST END] ==========");
        System.out.println("✅ renderList count=" + renderList.size());
        return renderList;
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

                int repAirlineId = resolveRepresentativeAirlineId(parsed.getFlights());

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
                                                    buildOfferInsertParam(legReq, repAirlineId)
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
                                        buildHistoryRowFromParsed(parsed, legReq, offerId, repAirlineId);

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
        leg.setMemberNo(origin.getMemberNo());

        return leg;
    }

    private Map<String, Object> buildOfferInsertParam(
            FlightSearchRequestDto request,
            int airlineId
    ) {
        Map<String, Object> p = new java.util.LinkedHashMap<>();
        p.put("oneWay", "ONEWAY".equals(request.getTripType()) ? "Y" : "N");
        p.put("departDate", Date.valueOf(request.getDepartDate()));
        p.put("returnDate",
                request.getReturnDate() != null
                        ? Date.valueOf(request.getReturnDate())
                        : null);
        p.put("depDurTotal", 0);
        p.put("retDurTotal", null);
        p.put("extraSeat", safeInt(request.getAdultCount()) + safeInt(request.getMinorCount()));
        p.put("isDel", "N");
        p.put("airlineId", airlineId);

        return p;
    }

    private FlightSearchCacheVo buildHistoryRowFromParsed(
            ParsedOfferDto parsed,
            FlightSearchRequestDto request,
            Long offerId,
            int airlineId
    ) {

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
                .airlineId(airlineId)
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

    private List<AirlineListVo> toAirlineListRows(
            List<FlightVo> flights,
            ParsedOfferDto parsed,
            FlightSearchRequestDto request
    ) {
        List<AirlineListVo> rows = new ArrayList<>();
        if (flights == null || flights.isEmpty()) return rows;

        Double totalPrice = parsed.getTotalPrice() != null ? parsed.getTotalPrice().doubleValue() : null;

        for (FlightVo f : flights) {
            AirlineListVo row = new AirlineListVo();

            row.setAirlineName(null);
            row.setFlightNumber(f.getFlightNumber());

            row.setDepartDate(f.getFlightDepartDate());
            row.setDepartCity(null);
            row.setDepartAirportCode(f.getDepartAirport());

            row.setFlightDuration(f.getFlightDuration());
            row.setTripType(request.getTripType());

            row.setArriveDate(f.getFlightArriveDate());
            row.setArriveCity(null);
            row.setArriveAirportCode(f.getDestAirport());

            row.setExtraSeat(safeInt(request.getAdultCount()) + safeInt(request.getMinorCount()));
            row.setFlightOfferId(f.getFlightOfferId());
            row.setTotalPrice(totalPrice);

            rows.add(row);
        }

        return rows;
    }
}

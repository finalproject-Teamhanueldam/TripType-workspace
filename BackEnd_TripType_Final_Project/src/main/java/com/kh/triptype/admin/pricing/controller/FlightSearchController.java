package com.kh.triptype.admin.pricing.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.admin.pricing.model.dto.FlightSearchRequestDto;
import com.kh.triptype.admin.pricing.service.FlightSearchService;

import lombok.RequiredArgsConstructor;

/**
 * 항공권 검색 컨트롤러
 * - 사용자 검색 요청 수신
 * - (팀원 목록 페이지는 DB 조회로 화면 구성)
 *
 * ✅ 변경 포인트
 * - 목록 페이지에서 응답 DTO를 사용하지 않으므로 ResponseEntity<Void>로 변경
 * - 서비스 반환값은 호출만 하고 무시 (DB INSERT/캐시 적재 목적)
 */
@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class FlightSearchController {

    private final FlightSearchService flightSearchService;

    /**
     * 항공권 검색 (편도 / 왕복 / 다구간 공통)
     * - DB 적재를 트리거하고 응답은 바디 없이 즉시 반환
     */
    @PostMapping("/search")
    public ResponseEntity<Void> searchFlights(@RequestBody FlightSearchRequestDto request) {

        // 🔍 요청 확인 로그 (디버깅용)
        System.out.println("✈️ 항공권 검색 요청 수신");
        System.out.println(request);
        System.out.println("👉 searchFlights service 호출 직전");

        // ✅ 팀원 화면은 DB 조회를 하므로 응답 DTO는 필요 없음 (반환값 무시)
        flightSearchService.searchFlights(request);

        System.out.println("👉 searchFlights service 호출 완료");
        return ResponseEntity.ok().build();
    }
}

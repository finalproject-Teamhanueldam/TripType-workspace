package com.kh.triptype.admin.pricing.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.admin.pricing.model.dto.FlightSearchRequestDto;
import com.kh.triptype.admin.pricing.model.dto.FlightSearchResponseDto;
import com.kh.triptype.admin.pricing.service.FlightSearchService;

import lombok.RequiredArgsConstructor;

/**
 * 항공권 검색 컨트롤러
 * - 사용자 검색 요청 수신
 * - 검색 기록 저장
 * - 1시간 캐시 판단
 * - API 호출 / DB 조회 분기
 */
@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // 🔥 프론트(vite) 허용
public class FlightSearchController {

    private final FlightSearchService flightSearchService;

    /**
     * 항공권 검색 (편도 / 왕복 / 다구간 공통)
     */
    @PostMapping("/search")
    public ResponseEntity<FlightSearchResponseDto> searchFlights(
            @RequestBody FlightSearchRequestDto request) {

        // 🔍 요청 확인 로그 (디버깅용)
        System.out.println("✈️ 항공권 검색 요청 수신");
        System.out.println(request);

        FlightSearchResponseDto response =
                flightSearchService.searchFlights(request);

        return ResponseEntity.ok(response);
    }
}

package com.kh.triptype.admin.pricing.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 항공권 검색 요청 DTO
 * - 프론트에서 전달되는 검색 조건 전용
 * - 편도 / 왕복 / 다구간 공통 처리
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightSearchRequestDto {

    /**
     * 여행 타입
     * ONEWAY | ROUND | MULTI
     */
    private String tripType;

    /* ===============================
       🔹 승객 정보
       =============================== */

    /** 성인 승객 수 (기본 1명) */
    private int adultCount;

    /** 소아 + 유아 승객 수 (기본 0명) */
    private int minorCount;

    /* ===============================
       🔹 편도 / 왕복 공통
       =============================== */

    /** 출발지 (IATA 코드) */
    private String depart;

    /** 도착지 (IATA 코드) */
    private String arrive;

    /** 출발일 (yyyy-MM-dd) */
    private String departDate;

    /** 귀국일 (왕복일 경우만 사용, yyyy-MM-dd) */
    private String returnDate;

    /* ===============================
       🔹 다구간 전용
       =============================== */

    /** 다구간 구간 리스트 */
    private List<FlightSegmentDto> segments;
    

    /* ===============================
       🔹 사용자 정보 (🔥 추가)
       =============================== */

    /**
     * 회원 번호
     * - 현재: 프론트에서 전달 안 해도 됨 (null)
     * - 추후: 로그인 시 JWT / 세션 기반으로 사용
     */
    private Long memberNo;
}

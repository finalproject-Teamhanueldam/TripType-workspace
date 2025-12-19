package com.kh.triptype.admin.pricing.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 항공권 단일 검색 결과 DTO
 * - DB VO를 그대로 노출하지 않기 위한 응답 전용 객체
 * - 프론트에서 바로 사용 가능한 형태
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightOfferResultDto {

    /** 항공편 제안 ID (DB 기준, MULTI는 0) */
    private int flightOfferId;

    /** 총 가격 */
    private String priceTotal;

    /** 통화 코드 (KRW, USD 등) */
    private String currency;

    /** 편도 여부 (Y/N) */
    private String oneWay;

    /** 출발일 (yyyy-MM-dd) */
    private String departDate;

    /** 귀국일 (yyyy-MM-dd, 편도일 경우 null) */
    private String returnDate;

    /** 항공사 ID (MULTI는 0) */
    private int airlineId;

    /** API 조회 기준 날짜 (가격 기준 시점) */
    private String apiQueryDate;
}

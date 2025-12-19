package com.kh.triptype.admin.pricing.model.vo;

import java.sql.Date;
import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 항공권 검색 결과 캐시 VO
 * - 1시간 이내 동일 조건 검색 시 재사용
 * - 실제 항공편(offer)과 분리된 검색 캐시 전용
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightSearchCacheVo {

    /** 검색 캐시 PK */
    private int flightPriceHistoryNo;

    /** 항공편 제안 ID (외부 API 기준, 논리적 식별자) */
    private int flightOfferId;

    /** 항공권 총 가격 */
    private BigDecimal flightOfferPriceTotal;

    /** 통화 코드 (KRW, USD 등) */
    private String flightOfferCurrency;

    /** 편도 여부 (Y/N) */
    private String flightOfferOneWay;

    /** 출발일 */
    private Date flightOfferDepartDate;

    /** 귀국일 (편도일 경우 null) */
    private Date flightOfferReturnDate;

    /** API 조회 기준 날짜 (캐시 기준 시간) */
    private Date flightOfferApiQueryDate;

    /** 출발 공항 IATA 코드 */
    private String departIataCode;

    /** 도착 공항 IATA 코드 */
    private String arriveIataCode;

    /** 항공사 내부 식별자 (FK, nullable) */
    private Integer airlineId;
}

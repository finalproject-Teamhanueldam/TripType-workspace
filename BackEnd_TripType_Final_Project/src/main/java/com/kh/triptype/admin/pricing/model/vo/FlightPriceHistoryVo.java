package com.kh.triptype.admin.pricing.model.vo;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightPriceHistoryVo {

    /** 항공편 제안 ID (PK) */
    private int flightOfferId;

    /** 항공권 총 가격 */
    private String flightOfferPriceTotal;

    /** 통화 코드 (KRW, USD 등) */
    private String flightOfferCurrency;

    /** 편도 여부 (Y/N) */
    private String flightOfferOneWay;

    /** 출발일 */
    private Date flightOfferDepartDate;

    /** 귀국일 */
    private Date flightOfferReturnDate;

    /** API 조회 기준 날짜 */
    private Date flightOfferApiQueryDate;

    /** 항공편 삭제/마감 여부 (Y/N) */
    private String flightOfferIsDel;

    /** 항공사 내부 식별자 (FK) */
    private int airlineId;
}

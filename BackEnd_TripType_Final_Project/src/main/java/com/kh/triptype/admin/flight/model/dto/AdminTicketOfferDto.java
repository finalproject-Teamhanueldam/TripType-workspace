package com.kh.triptype.admin.flight.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AdminTicketOfferDto {

    /** 항공권 Offer 기본 정보 */
    private Long flightOfferId;

    /** 편도 / 왕복 여부 (Y / N) */
    private String oneWayYn;

    /** 항공사명 */
    private String airlineName;

    /** 가는 편 */
    private AdminFlightSegmentDto outbound;

    /** 오는 편 (왕복일 경우만 존재) */
    private AdminFlightSegmentDto inbound;

    /** 가격 */
    private BigDecimal priceTotal;

    /** 통화 */
    private String currency;

    /** 최근 API 조회 시점 */
    private LocalDateTime apiQueryDate;
    
    private List<Long> flightOfferIds;
}

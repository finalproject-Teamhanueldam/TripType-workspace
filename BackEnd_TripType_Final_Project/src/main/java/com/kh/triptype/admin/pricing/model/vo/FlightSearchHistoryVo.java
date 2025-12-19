package com.kh.triptype.admin.pricing.model.vo;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 항공권 검색 기록 VO
 * - 사용자 검색 로그 DB 저장용
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightSearchHistoryVo {

    /** 검색 로그 PK */
    private int searchLogNo;

    /** 편도 여부 (Y/N) */
    private String searchLogOneWay;

    /** 승객 수 */
    private int searchLogPassengerCount;

    /** 출발일 */
    private Date searchLogDepartDate;

    /** 귀국일 */
    private Date searchLogReturnDate;

    /** 검색 시각 */
    private Date searchLogDate;

    /** 회원 번호 */
    private Long memberNo;

    /** 출발 공항 IATA 코드 */
    private String departIataCode;

    /** 도착 공항 IATA 코드 */
    private String arriveIataCode;
}

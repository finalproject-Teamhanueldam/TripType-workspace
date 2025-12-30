package com.kh.triptype.airline.model.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class AirlineFilter {
	/* 여행 타입 (ROUND, ONEWAY, MULTI) */
    private String tripType;

    /* 출발 공항 (IATA 코드) */
    private String depart;

    /* 도착 공항 (IATA 코드) */
    private String arrive;

    /* 출발일 (yyyy-MM-dd) */
    private String departDate;

    /* 귀국일 (왕복일 경우만 사용) */
    private String returnDate;

    /* 성인 승객 수 */
    private int adultCount;

    /* 소아 승객 수 */
    private int minorCount;
    
    
}

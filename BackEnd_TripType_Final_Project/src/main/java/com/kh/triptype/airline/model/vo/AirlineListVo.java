package com.kh.triptype.airline.model.vo;

import java.sql.Date;
import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("AirlineListVo")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class AirlineListVo {

    /* ================= 항공사 / 항공기 ================= */

    // 항공사명 (TB_AIRLINE)
    private String airlineName;           // AIRLINE_AIRLINE_NAME

    // 항공기 번호 (TB_FLIGHT)
    private String flightNumber;           // FLIGHT_NUMBER


    /* ================= 출발 정보 ================= */

    // 출발 날짜
    private LocalDateTime departDate;             // FLIGHT_DEPART_DATE

    // 출발 도시
    private String departCity;             // AIRPORT_CITY

    // 출발 공항 코드
    private String departAirportCode;      // AIRPORT_IATA_CODE


    /* ================= 가운데 정보 ================= */

    // 이동 시간
    private String flightDuration;            // FLIGHT_DURATION (분 단위 추천)

    // 편도 / 왕복 / 다구간
    private String tripType;               // ONE / ROUND / MULTI


    /* ================= 도착 정보 ================= */

    // 도착 날짜
    private LocalDateTime arriveDate;             // FLIGHT_ARRIVE_DATE

    // 도착 도시
    private String arriveCity;             // AIRPORT_CITY

    // 도착 공항 코드
    private String arriveAirportCode;      // AIRPORT_IATA_CODE
    
    
    /* ================= 부가 정보 ================= */

    // 잔여 좌석 수
    private int extraSeat;                 // FLIGHT_OFFER_EXTRA_SEAT
    
    // 오퍼 번호
    private int flightOfferId;
    
    // 가격
    private Double totalPrice;
    
    // 경유 횟수
    private int flightSegmentNo;
}


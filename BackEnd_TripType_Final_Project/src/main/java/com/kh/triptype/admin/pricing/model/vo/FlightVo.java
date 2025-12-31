package com.kh.triptype.admin.pricing.model.vo;

import java.sql.Date;
import java.time.LocalDateTime;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class FlightVo {

    /** PK (트리거/시퀀스로 들어가면 null 허용이 자연스러움) */
    private Integer flightId;

    /** 세그먼트 순번 */
    private Integer flightSegmentNo;

    /** 항공편 번호 (KE123 등) */
    private String flightNumber;

    /** 출발 일자(또는 시각이 필요하면 Timestamp로 확장) */
    private LocalDateTime flightDepartDate;

    /** 도착 일자 */
    private LocalDateTime flightArriveDate;

    /** 세그먼트 소요 시간 (PT2H35M) */
    private String flightDuration;

    /** 가는편(O) / 오는편(I) */
    private String flightDirection;

    /** 출발 공항 IATA */
    private String departAirport;

    /** 도착 공항 IATA */
    private String destAirport;

    /** 실제 운항 항공사 */
    private Integer operAirlineId;

    /** 판매 항공사 */
    private Integer sellingAirlineId;

    /** FK (offerId는 "나중에" 생기므로 Integer가 맞음) */
    private Integer flightOfferId;
 
    
}

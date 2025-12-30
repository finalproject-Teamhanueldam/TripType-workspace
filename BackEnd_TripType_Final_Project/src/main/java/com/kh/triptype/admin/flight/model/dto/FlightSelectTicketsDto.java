package com.kh.triptype.admin.flight.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("tickets")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class FlightSelectTicketsDto {
	
	private int flightOfferId;
	private String oneWayYn;          // Y/N
    private String sellingAirlineUrl;
    private String sellingAirlineName;
    // 출발편
    private LocalDateTime departDateTime;
    private LocalDateTime arriveDateTime;
    private String departAirport;
    private String arriveAirport;
    private String departDuration;
    private BigDecimal priceTotal;
    // 조회 기준
    private LocalDateTime apiQueryDate;
}

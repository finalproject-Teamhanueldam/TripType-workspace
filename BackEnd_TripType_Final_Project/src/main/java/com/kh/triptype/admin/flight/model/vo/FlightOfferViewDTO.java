package com.kh.triptype.admin.flight.model.vo;

import java.sql.Date;
import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Alias("flightofferview")
@NoArgsConstructor
@Getter
@Setter
@ToString

// 관리자 페이지 항공권 정보 조회시 필요한 컬럼만
public class FlightOfferViewDTO {
	
	// TB_AIRLINE
	private String airlineUrl;
	
	// TB_FLIGHT
	private String departAirport;
	private String destAirport;
	
	private Date flightDepartDate;
	private Date flightArriveDate;
	
	private double flightPrice;
	
	// TB_FLIGHT_OFFER
	private LocalDateTime offerApiQueryDate;
}

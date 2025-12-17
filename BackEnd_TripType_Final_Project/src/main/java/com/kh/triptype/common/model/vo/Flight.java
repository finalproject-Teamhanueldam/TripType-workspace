package com.kh.triptype.common.model.vo;

import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("flight")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Flight {
	
	private int flightId;			//	FLIGHT_ID	NUMBER 시퀀스
	private int flightSegmentNo;	//	FLIGHT_SEGMENT_NO	NUMBER 경유 번호
	private int flightNo;			//	FLIGHT_NUMBER	NUMBER 항공편명
	private LocalDateTime flightDepartDate;	//	FLIGHT_DEPART_DATE	DATE
	private LocalDateTime flightArriveDate;	//	FLIGHT_ARRIVE_DATE	DATE
	private String flightDuration;	//	FLIGHT_DURATION	VARCHAR2(100 BYTE)
	private int flightExtraSeat;	//	FLIGHT_EXTRA_SEAT	NUMBER
	private double flightPrice;		//	FLIGHT_PRICE	VARCHAR2(100 BYTE)
	private String FlightIsDel;		//	FLIGHT_IS_DEL	CHAR(1 BYTE)
	private String departAirport;	//	DEPART_AIRPORT	VARCHAR2(3 BYTE)
	private String destAirport;		//	DEST_AIRPORT	VARCHAR2(3 BYTE)
	private int operAirlineId;		//	OPER_AIRLINE_ID	NUMBER 운항 항공사
	private int sellingAirlineId;	//	SELLING_AIRLINE_ID	NUMBER 판매 항공사
	private int flightOperId;			//	FLIGHT_OFFER_ID	NUMBER 

}

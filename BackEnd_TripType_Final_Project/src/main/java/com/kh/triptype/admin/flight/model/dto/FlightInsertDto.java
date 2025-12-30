package com.kh.triptype.admin.flight.model.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class FlightInsertDto {
	

	private int flightId;						//	FLIGHT_ID	NUMBER PK 시퀀스
	private int segmentNo;						//	FLIGHT_SEGMENT_NO	NUMBER
	private String flightNo;						//	FLIGHT_NUMBER	NUMBER 항공기 번호
	private LocalDateTime departDateTime;		//	FLIGHT_DEPART_DATE	DATE
	private LocalDateTime arriveDateTime;		//	FLIGHT_ARRIVE_DATE	DATE
	private String duration;					//	FLIGHT_DURATION	VARCHAR2(100 BYTE)
	private String isDel;						//	FLIGHT_IS_DEL	CHAR(1 BYTE)
	private String departAirport;				//	DEPART_AIRPORT	VARCHAR2(3 BYTE)
	private String destAirport;					//	DEST_AIRPORT	VARCHAR2(3 BYTE)
	private Integer offerAirlineId;					//	OPER_AIRLINE_ID	
	private Integer sellAirlineId;					//	SELLING_AIRLINE_ID	NUMBER
	private int offerId;						//	FLIGHT_OFFER_ID	NUMBER
	private String direction;					//	FLIGHT_DIRECTION	CHAR(1 BYTE)
}

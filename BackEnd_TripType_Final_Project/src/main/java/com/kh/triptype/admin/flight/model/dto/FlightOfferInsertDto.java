package com.kh.triptype.admin.flight.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class FlightOfferInsertDto {
	
	
	private int offerId;						//	FLIGHT_OFFER_ID	NUMBER
	private	BigDecimal priceTotal;				//	FLIGHT_OFFER_PRICE_TOTAL	VARCHAR2(100 BYTE)
	private String oneWay;						//	FLIGHT_OFFER_ONE_WAY	CHAR(1 BYTE)
	private LocalDateTime departDate;			 //	FLIGHT_OFFER_DEPART_DATE	DATE
	private LocalDateTime returnDate;			//	FLIGHT_OFFER_RETURN_DATE	DATE
	private String departDurationTotal;
	private String returnDurationTotal;
	private LocalDateTime apiQueryDate;			//	FLIGHT_OFFER_API_QUERY_DATE	DATE
	private String isDel;						//	FLIGHT_OFFER_IS_DEL	CHAR(1 BYTE)
	private int airlineId;					//	AIRLINE_ID	NUMBER
	private int extraSeat;						//	FLIGHT_OFFER_EXTRA_SEAT	NUMBER
							
}

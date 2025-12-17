package com.kh.triptype.common.model.vo;

import java.sql.Date;
import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("offer")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class FlightOffer {
	
	private int offerId;			//	FLIGHT_OFFER_ID	NUMBER
	private double offerPriceTotal; //	FLIGHT_OFFER_PRICE_TOTAL	VARCHAR2(100 BYTE)
	private String offerCurrency;	//	FLIGHT_OFFER_CURRENCY	VARCHAR2(10 BYTE)
	private String offerOneWay;		//	FLIGHT_OFFER_ONE_WAY	CHAR(1 BYTE)
	private Date offerDepartDate;	//	FLIGHT_OFFER_DEPART_DATE	DATE
	private Date offerReturnDate;	//	FLIGHT_OFFER_RETURN_DATE	DATE
	private LocalDateTime offerApiQueryDate; //	FLIGHT_OFFER_API_QUERY_DATE	DATE
	private String offerIsDell;		//	FLIGHT_OFFER_IS_DEL	CHAR(1 BYTE)
	private int airlineId;			//	AIRLINE_ID	NUMBER

}

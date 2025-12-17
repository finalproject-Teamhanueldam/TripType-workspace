package com.kh.triptype.common.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("airline")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Airline {
	
	private int airlineId;				//	AIRLINE_ID	NUMBER
	private String airlineName;			//	AIRLINE_AIRLINE_NAME	VARCHAR2(200 BYTE)
	private String airlineIataCode;		//	AIRLINE_IATA_CODE	VARCHAR2(3 BYTE)
	private String airlineCountry;		//	AIRLINE_COUNTRY	VARCHAR2(100 BYTE)
	private String airlineUrl;			//	AIRLINE_URL	VARCHAR2(200 BYTE)
	private String airportTeam;			//	AIRPORT_TEAM	VARCHAR2(255 BYTE)

}

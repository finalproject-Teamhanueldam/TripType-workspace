package com.kh.triptype.mypage.model.dto;

import java.sql.Date;
import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Alias("SearchHistoryDto")
public class SearchHistoryDto {
	
	private int searchLogNo;				//	SEARCH_LOG_NO	NUMBER
	private String oneWay;					//	SEARCH_LOG_ONE_WAY	CHAR(1 BYTE)
	private int passengerCount;				//	SEARCH_LOG_PASSENGER_COUNT	NUMBER
	private Date departDate;				//	SEARCH_LOG_DEPART_DATE	DATE
	private Date returnDate;				//	SEARCH_LOG_RETURN_DATE	DATE
	private LocalDateTime searchLogDate;	//	SEARCH_LOG_DATE	DATE
	private int memberNo;					//	MEMBER_NO	NUMBER
	private String departIata;				//	DEPART_IATA_CODE	VARCHAR2(3 BYTE)
	private String arriveIata;				//	ARRIVE_IATA_CODE	VARCHAR2(3 BYTE)
}

package com.kh.triptype.airline.model.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class PriceChangeDto {
	
	// 출발일(기준)
	private Date departDate;
	
	// 여행 타입 (편도/왕복)
	private String tripType;
	
	// 출발지
	private String depart;
	
	// 도착지
	private String arrive;

}

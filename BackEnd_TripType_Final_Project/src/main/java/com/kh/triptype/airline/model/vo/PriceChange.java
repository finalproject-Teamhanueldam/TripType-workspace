package com.kh.triptype.airline.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("PriceChange")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class PriceChange {
	
	// 가격
	private int price;
	
	// 날짜(출발)
	private Date departDate;
	
	// 출발지
	private String depart;
	
	// 도착지
	private String arrive;
	
	// 여행 타입 (왕복/편도)
	private String tripType;
	

}

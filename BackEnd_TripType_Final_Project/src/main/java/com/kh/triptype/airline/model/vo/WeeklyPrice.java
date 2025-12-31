package com.kh.triptype.airline.model.vo;

import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("WeeklyPrice")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class WeeklyPrice {
	
	// 주간 날짜
	private String offerDepartDay;
	
	// 주간 가격
	private double offerPriceTotal;

}

package com.kh.triptype.admin.statistics.model.dto;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Alias("TopReviewAirline")
public class TopReviewAirlineDto {
	
	private int airlineId;
	private String airlineName;
	private int reviewCount;
	private double averageReviewRating; 
}

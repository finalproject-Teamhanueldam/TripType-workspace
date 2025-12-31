package com.kh.triptype.admin.review.model.vo;

import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Alias("adminAirlineReview")
public class AirlineReviewVo {
	
	private int reviewNo;					//	REVIEW_NO	NUMBER
	private String reviewContent;			//	REVIEW_CONTENT	VARCHAR2(300 BYTE)
	private double reviewRating;			//	REVIEW_RATING	NUMBER
	private LocalDateTime reviewCreateDate;	//	REVIEW_CREATE_DATE	DATE
	private LocalDateTime reviewModifyDate;	//	REVIEW_MODIFY_DATE	DATE
	private String reviewStatus;			//	REVIEW_STATUS	CHAR(1 BYTE)
	private int memberNo;					//	MEMBER_NO	NUMBER
	private int airlineId;					//	AIRLINE_ID	NUMBER
	private String airlineName;
	private Integer reviewCount;
	private Double avgRating;
}

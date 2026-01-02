package com.kh.triptype.airline.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("Review")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Review {
	
	// 날짜
	private Date reviewCreateDate;
	
	// 이름
	private String memberName;
	
	// 댓글 내용
	private String reviewContent;

}

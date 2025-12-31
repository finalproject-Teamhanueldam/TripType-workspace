package com.kh.triptype.admin.statistics.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Alias("MonthlySignUp")
public class MonthlySignUpDto {
	
	private String month;        // YYYY-MM
    private int joinCount;       // 가입자 수
    private int withdrawCount;   // 탈퇴자 수
		
}

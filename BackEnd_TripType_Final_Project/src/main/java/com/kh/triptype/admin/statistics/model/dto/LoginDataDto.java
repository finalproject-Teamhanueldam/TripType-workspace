package com.kh.triptype.admin.statistics.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Alias("LoginData")
public class LoginDataDto {
	
	private int loginCount;
	private int notLoginCount;

}

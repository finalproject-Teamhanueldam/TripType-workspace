package com.kh.triptype.mypage.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Alias("MySocialConnectionDto")
@Getter
@AllArgsConstructor
public class MySocialConnectionDto {
    private String provider; // "KAKAO" / "NAVER"
    private String email;    // 없으면 null
}

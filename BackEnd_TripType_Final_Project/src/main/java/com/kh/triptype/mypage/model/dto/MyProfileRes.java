package com.kh.triptype.mypage.model.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Alias("MyProfileRes")
@Getter
@Setter
@ToString
public class MyProfileRes {

    private String memberId;
    private String memberName;

    private LocalDate memberBirthDate;          // 변경
    private String memberGender;
    private String memberPhone;

    private LocalDateTime memberCreateAt;        // 변경
    private LocalDateTime memberLastLoginAt;     // 변경
    
    // 추가 1) 소셜 회원이면 비번 변경 막기 위한 플래그
    private boolean hasPassword;

    // 추가 2) 소셜 연동 목록
    private List<MySocialConnectionDto> socialConnections;

}
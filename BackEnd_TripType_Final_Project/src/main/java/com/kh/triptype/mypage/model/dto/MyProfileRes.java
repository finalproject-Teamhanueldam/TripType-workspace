package com.kh.triptype.mypage.model.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.ToString;

@Alias("MyProfileRes")
@Getter
@ToString
public class MyProfileRes {

    private String memberId;
    private String memberName;

    private LocalDate memberBirthDate;          // 변경
    private String memberGender;
    private String memberPhone;

    private LocalDateTime memberCreateAt;        // 변경
    private LocalDateTime memberLastLoginAt;     // 변경

  // 소셜 연동 기능 성공하면 여기에 확장
  // private String socialProvider;
  // private String socialEmail;
  // private String socialConnected; // Y/N
}
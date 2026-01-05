package com.kh.triptype.mypage.model.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MyProfileUpdateReq {
    private String memberName;
    private LocalDate memberBirthDate;
    private String memberGender;
    private String memberPhone;
}

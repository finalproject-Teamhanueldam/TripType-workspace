package com.kh.triptype.member.model.vo;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Alias("Member")
@Getter
@Setter
public class Member {
    private int memberNo;
    private String memberId;
    private String memberPassword;
    private String memberName;

    private LocalDate memberBirthDate;   // 변경

    private String memberGender;
    private String memberPhone;

    private String memberRole;
    private LocalDateTime memberCreateAt; // 변경
    private LocalDateTime memberWithdrawnAt;// 변경
    private LocalDateTime memberLastLoginAt;// 변경

    private String memberIsActive;
    private Integer memberLoginFailCount;
    private String memberIsLocked;
    private LocalDateTime memberUnlockTime;
}

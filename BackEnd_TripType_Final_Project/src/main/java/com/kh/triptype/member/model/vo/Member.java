package com.kh.triptype.member.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("Member")
public class Member {
    private int memberNo;
    private String memberId;
    private String memberPassword;
    private String memberName;
    private Date memberBirthDate;
    private String memberGender;
    private String memberPhone;

    private String memberRole; // default USER (DB default)
    private Date memberCreateAt;
    private Date memberWithdrawnAt;
    private Date memberLastLoginAt;

    private String memberIsActive; // default 'Y'
    private Integer memberLoginFailCount; // default 0
    private String memberIsLocked; // default 'N'
    private Date memberUnlockTime;
}
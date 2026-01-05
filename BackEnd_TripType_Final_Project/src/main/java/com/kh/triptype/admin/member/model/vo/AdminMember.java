package com.kh.triptype.admin.member.model.vo;

import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Alias("AdminMember")
@Getter
@Setter
public class AdminMember {

    private int memberNo;
    private String memberId;          // 이메일
    private String memberName;
    private String memberBirthDate;   // YYYY-MM-DD
    private String memberPhone;
    private String memberRole;        // USER / ADMIN

    private String memberIsActive;    // Y / N
    private String memberIsLocked;    // Y / N

    private LocalDateTime memberCreateAt;
    private LocalDateTime memberLastLoginAt;
    
    /* ===== 소셜 로그인 관련 ===== */
    private String socialProviders;   // "KAKAO, NAVER"
    private String isSocial;           // Y / N
    private String hasPassword;      // Y / N (일반 로그인 가능 여부)
}

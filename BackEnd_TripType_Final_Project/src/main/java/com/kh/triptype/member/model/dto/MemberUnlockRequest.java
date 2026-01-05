package com.kh.triptype.member.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberUnlockRequest {

    private String memberName;      // 이름
    private String memberId;        // 이메일 (로그인 ID)
    private String authCode;        // 이메일 인증번호
    private String newPassword;     // 새 비밀번호
}

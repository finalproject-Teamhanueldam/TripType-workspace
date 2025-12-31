package com.kh.triptype.member.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberPasswordResetRequest {
    private String memberId;      // 이메일
    private String newPassword;   // 새 비밀번호
}

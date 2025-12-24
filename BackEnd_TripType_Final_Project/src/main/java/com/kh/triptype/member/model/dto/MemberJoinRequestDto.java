package com.kh.triptype.member.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberJoinRequestDto {
	private String memberId;
    private String memberPassword;
    private String memberName;
    private String memberBirthDate;
    private String memberGender;
    private String memberPhone;
    private String authCode;
}

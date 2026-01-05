package com.kh.triptype.member.model.dto;

public record MemberMeResponse(
    int memberNo,
    String memberId,
    String memberName,
    String role
) {}

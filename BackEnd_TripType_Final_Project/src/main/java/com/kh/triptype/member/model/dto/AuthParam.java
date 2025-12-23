package com.kh.triptype.member.model.dto;

public class AuthParam {

    private String memberId;
    private String authCode;
    private int expireMinutes;

    public AuthParam(String memberId, String authCode, int expireMinutes) {
        this.memberId = memberId;
        this.authCode = authCode;
        this.expireMinutes = expireMinutes;
    }

    public String getMemberId() {
        return memberId;
    }

    public String getAuthCode() {
        return authCode;
    }

    public int getExpireMinutes() {
        return expireMinutes;
    }
}

package com.kh.triptype.auth.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    private String memberId;
    private String memberPassword;
}
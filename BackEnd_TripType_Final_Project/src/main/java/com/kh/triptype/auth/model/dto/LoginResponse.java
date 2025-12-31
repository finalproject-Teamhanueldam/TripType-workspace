package com.kh.triptype.auth.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private String accessToken;
    private String memberName;
    private String role;
}
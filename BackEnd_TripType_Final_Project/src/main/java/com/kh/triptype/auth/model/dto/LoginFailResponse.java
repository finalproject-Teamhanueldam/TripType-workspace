package com.kh.triptype.auth.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginFailResponse {
    private String message;
    private int loginFailCount;
    private boolean locked;
}
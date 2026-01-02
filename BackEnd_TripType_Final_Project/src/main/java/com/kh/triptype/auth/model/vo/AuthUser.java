package com.kh.triptype.auth.model.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthUser {
    private int memberNo;
    private String role;
}
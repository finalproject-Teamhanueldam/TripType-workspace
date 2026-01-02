package com.kh.triptype.mypage.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MyPasswordChangeReq {
    private String currentPassword;
    private String newPassword;
}

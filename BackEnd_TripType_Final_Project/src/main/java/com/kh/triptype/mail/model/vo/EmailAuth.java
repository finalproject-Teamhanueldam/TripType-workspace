package com.kh.triptype.mail.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Alias("EmailAuth")
public class EmailAuth {
    private String authEmail;
    private String authCode;
    private Date authDate;
    private String authVerified; // 'Y' or 'N'
}
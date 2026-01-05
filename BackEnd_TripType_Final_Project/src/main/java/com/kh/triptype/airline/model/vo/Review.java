package com.kh.triptype.airline.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("Review")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Review {

    private int reviewNo;
    private String reviewContent;
    private Date reviewCreateDate;
    private Date reviewModifyDate;
    private String reviewStatus;

    private int memberNo;
    private int flightOfferId;
    
    private String memberName;
}
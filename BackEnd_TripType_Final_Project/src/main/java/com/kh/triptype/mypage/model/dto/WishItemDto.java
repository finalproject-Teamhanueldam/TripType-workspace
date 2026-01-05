package com.kh.triptype.mypage.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Alias("WishItemDto")
@Getter
@Setter
public class WishItemDto {

    private long flightOfferId;

    private String departAirportCode;
    private String arriveAirportCode;

    private String tripType; // ONEWAY / ROUND
    private String departDate;
    private String returnDate;

    private Long totalPrice;
}
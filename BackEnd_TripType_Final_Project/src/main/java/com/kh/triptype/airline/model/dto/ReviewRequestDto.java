package com.kh.triptype.airline.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ReviewRequestDto {

    // 클라이언트가 보내는 것만
    private String reviewContent;
    private int flightOfferId;
}

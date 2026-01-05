package com.kh.triptype.survey.model.dto;

import lombok.Data;

@Data
public class SurveySaveRequestDto {

    // 프론트: typeCode
    private String typeCode;

    // 프론트: relaxScore/cityScore/natureScore/activityScore
    private Integer relaxScore;
    private Integer cityScore;
    private Integer natureScore;
    private Integer activityScore;
}


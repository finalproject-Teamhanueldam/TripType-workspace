package com.kh.triptype.member.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SurveyJoinDto {
  private String typeCode;     // SURVEY_RESULT
  private int relaxScore;      // SURVEY_RELAX_SCORE
  private int cityScore;       // SURVEY_CITY_SCORE
  private int natureScore;     // SURVEY_NATURE_SCORE
  private int activityScore;   // SURVEY_ACTIVITY_SCORE

  // answers는 DB 컬럼에 없으니 join에 굳이 받을 필요 없음(받아도 저장 안 함)
}

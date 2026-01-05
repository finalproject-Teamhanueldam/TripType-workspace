package com.kh.triptype.survey.model.vo;

import java.sql.Date;

import lombok.Data;

@Data
public class SurveyVo {

    /** PK */
    private Long surveyId;               // SURVEY_ID

    /** 설문 결과 타입 코드 (RELAX, CITY_NATURE, MIXED 등) */
    private String surveyResult;         // SURVEY_RESULT

    /** 설문 저장 시각 */
    private Date surveyCreatedAt;        // SURVEY_CREATED_AT

    /** 회원 번호 (회원당 1행, UNIQUE) */
    private Long memberNo;               // MEMBER_NO

    /** 4축 점수 */
    private Integer surveyRelaxScore;    // SURVEY_RELAX_SCORE
    private Integer surveyCityScore;     // SURVEY_CITY_SCORE
    private Integer surveyNatureScore;   // SURVEY_NATURE_SCORE
    private Integer surveyActivityScore; // SURVEY_ACTIVITY_SCORE
}

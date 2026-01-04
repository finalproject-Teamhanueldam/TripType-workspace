package com.kh.triptype.survey.service;

import com.kh.triptype.survey.model.dto.SurveySaveRequestDto;
import com.kh.triptype.survey.model.vo.SurveyVo;

public interface SurveyService {

    /**
     * =========================================================
     * 설문 결과 저장 (회원당 1행)
     * - 없으면 INSERT
     * - 있으면 UPDATE
     *
     * @param memberNo 로그인 사용자 번호(JWT에서 추출)
     * @param dto 프론트에서 넘어온 설문 결과
     * @return 처리된 행 수
     * =========================================================
     */
    int saveOrUpdateSurvey(Long memberNo, SurveySaveRequestDto dto);

    /**
     * =========================================================
     * (추가) 내 설문 결과 조회
     * - 게이트 페이지에서 사용
     * - 없으면 null 반환
     *
     * @param memberNo 로그인 사용자 번호
     * @return SurveyVo or null
     * =========================================================
     */
    SurveyVo selectSurveyByMemberNo(Long memberNo);
}

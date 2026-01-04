package com.kh.triptype.survey.service;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.triptype.survey.dao.SurveyDao;
import com.kh.triptype.survey.model.dto.SurveySaveRequestDto;
import com.kh.triptype.survey.model.vo.SurveyVo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SurveyServiceImpl implements SurveyService {

    private final SqlSessionTemplate sqlSession;
    private final SurveyDao surveyDao;

    /**
     * ✅ 회원당 1행 구조(TB_SURVEY)
     * - 기존 데이터 있으면 UPDATE
     * - 없으면 INSERT
     */
    @Override
    @Transactional
    public int saveOrUpdateSurvey(Long memberNo, SurveySaveRequestDto dto) {

        if (memberNo == null) {
            throw new IllegalArgumentException("memberNo is null");
        }
        if (dto == null) {
            throw new IllegalArgumentException("dto is null");
        }

        // ✅ DTO → VO 매핑 (VO는 DB 1:1 대응이라 필드명 그대로 세팅)
        SurveyVo vo = new SurveyVo();
        vo.setMemberNo(memberNo);

        // typeCode → SURVEY_RESULT
        vo.setSurveyResult(dto.getTypeCode());

        // 점수 매핑
        vo.setSurveyRelaxScore(dto.getRelaxScore());
        vo.setSurveyCityScore(dto.getCityScore());
        vo.setSurveyNatureScore(dto.getNatureScore());
        vo.setSurveyActivityScore(dto.getActivityScore());

        // ✅ 회원당 기존 설문 존재 여부
        int exists = surveyDao.existsByMemberNo(sqlSession, memberNo);

        if (exists > 0) {
            // UPDATE
            return surveyDao.updateSurvey(sqlSession, vo);
        }
        // INSERT
        return surveyDao.insertSurvey(sqlSession, vo);
    }

    /**
     * ✅ 내 설문 결과 조회 (게이트/마이페이지 공용)
     * - 없으면 null 반환
     */
    @Override
    public SurveyVo selectSurveyByMemberNo(Long memberNo) {

        if (memberNo == null) {
            throw new IllegalArgumentException("memberNo is null");
        }

        return surveyDao.selectSurveyByMemberNo(sqlSession, memberNo);
    }
}

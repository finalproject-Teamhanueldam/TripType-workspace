package com.kh.triptype.survey.dao;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.survey.model.vo.SurveyVo;

@Repository
public class SurveyDao {

    /** 회원당 1행 존재 여부 확인 */
    public int existsByMemberNo(SqlSessionTemplate sqlSession, Long memberNo) {
        return sqlSession.selectOne("surveyMapper.existsByMemberNo", memberNo);
    }

    /** INSERT (회원당 1행) */
    public int insertSurvey(SqlSessionTemplate sqlSession, SurveyVo vo) {
        return sqlSession.insert("surveyMapper.insertSurvey", vo);
    }

    /** UPDATE (회원당 1행) */
    public int updateSurvey(SqlSessionTemplate sqlSession, SurveyVo vo) {
        return sqlSession.update("surveyMapper.updateSurvey", vo);
    }

    /** 조회: 게이트/마이페이지/결과 페이지 공용 */
    public SurveyVo selectSurveyByMemberNo(SqlSessionTemplate sqlSession, Long memberNo) {
    	System.out.println("THREAD(dao)=" + Thread.currentThread().getName() + " memberNo=" + memberNo);

        return sqlSession.selectOne("surveyMapper.selectSurveyByMemberNo", memberNo);
    }
}

package com.kh.triptype.admin.pricing.dao;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.admin.pricing.model.vo.FlightSearchHistoryVo;

/**
 * 항공권 검색 기록 DAO
 * - 사용자 검색 시 검색 로그 저장
 */
@Repository
public class FlightSearchHistoryDao {

    /**
     * 항공권 검색 기록 저장
     *
     * @param sqlSession MyBatis SqlSessionTemplate
     * @param historyVo  검색 기록 VO
     * @return insert 결과 (1 성공 / 0 실패)
     */
    public int insertSearchHistory(
            SqlSessionTemplate sqlSession,
            FlightSearchHistoryVo historyVo
    ) {
        return sqlSession.insert(
                "flightSearchHistoryMapper.insertSearchHistory",
                historyVo
        );
    }
}

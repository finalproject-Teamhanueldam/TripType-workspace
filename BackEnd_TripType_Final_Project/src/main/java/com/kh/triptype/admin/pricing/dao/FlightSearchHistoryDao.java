package com.kh.triptype.admin.pricing.dao;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.admin.pricing.model.vo.FlightSearchHistoryVo;

/**
 * 항공권 검색 기록 DAO
 * - 사용자 검색 시 검색 로그 저장
 *
 * ✅ 수정 원칙
 * - 팀원 조회 로직과 완전히 분리
 * - 기존 매퍼/서비스 흐름 유지
 * - 속도 개선을 위해 불필요한 NPE·실행 방지 가드만 추가
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

        // ✅ 방어 코드: null 요청 시 DB 접근 자체를 막음
        if (historyVo == null) {
            return 0;
        }

        return sqlSession.insert(
                "flightSearchHistoryMapper.insertSearchHistory",
                historyVo
        );
    }
}

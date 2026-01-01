package com.kh.triptype.admin.pricing.dao;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AirlineDao {

    /**
     * IATA 코드로 AIRLINE_ID 조회
     * - 서비스에서 주입/보유한 sqlSession을 DAO로 전달받는 방식
     *
     * ✅ 변경 포인트(DAO 레벨 최소화)
     * 1) iataCode null/blank 가드
     * 2) trim 처리 (공백으로 조회 실패 방지)
     */
    public Integer selectAirlineIdByIataCode(
            SqlSessionTemplate sqlSession,
            String iataCode
    ) {
        if (iataCode == null) {
            return null;
        }

        String code = iataCode.trim();
        if (code.isEmpty()) {
            return null;
        }

        return sqlSession.selectOne(
                "airline.selectAirlineIdByIataCode",
                code
        );
    }
}

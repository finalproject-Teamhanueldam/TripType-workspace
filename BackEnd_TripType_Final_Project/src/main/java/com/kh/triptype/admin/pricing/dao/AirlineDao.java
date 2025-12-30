package com.kh.triptype.admin.pricing.dao;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AirlineDao {

    /**
     * IATA 코드로 AIRLINE_ID 조회
     * - 서비스에서 주입/보유한 sqlSession을 DAO로 전달받는 방식
     */
    public Integer selectAirlineIdByIataCode(
            SqlSessionTemplate sqlSession,
            String iataCode
    ) {
        return sqlSession.selectOne(
                "airline.selectAirlineIdByIataCode",
                iataCode
        );
    }
}

package com.kh.triptype.admin.pricing.dao;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.admin.pricing.model.vo.FlightVo;

@Repository
public class FlightDao {

    /**
     * FLIGHT 세그먼트 batch insert
     * - Service에서 전달받은 SqlSessionTemplate 사용
     */
    public int insertFlights(
            SqlSessionTemplate sqlSession,
            List<FlightVo> flights
    ) {
        return sqlSession.insert(
                "flight.insertFlights",
                flights
        );
    }
}

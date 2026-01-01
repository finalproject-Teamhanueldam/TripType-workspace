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
     *
     * ✅ 변경 포인트(DAO 레벨 최소화)
     * 1) null/empty 가드: 불필요한 mapper 호출 방지
     * 2) 호출부 안정성: flights가 비어있으면 0 리턴
     *
     * ⚠️ 실제 "배치" 성능은 mapper(FOREACH) 설정이 결정함.
     *    DAO는 그대로 두되, mapper가 다건 insert로 작성돼 있어야 진짜 빨라짐.
     */
    public int insertFlights(
            SqlSessionTemplate sqlSession,
            List<FlightVo> flights
    ) {
        if (flights == null || flights.isEmpty()) {
            return 0;
        }

        return sqlSession.insert(
                "flight.insertFlights",
                flights
        );
    }
}

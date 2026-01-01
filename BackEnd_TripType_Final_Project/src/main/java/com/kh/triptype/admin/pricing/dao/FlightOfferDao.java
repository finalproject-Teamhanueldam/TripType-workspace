package com.kh.triptype.admin.pricing.dao;

import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.admin.pricing.model.vo.FlightVo;

@Repository
public class FlightOfferDao {

    /**
     * 세그먼트 조합으로 기존 offerId 조회
     *
     * ✅ 변경 포인트(DAO 레벨 최소화)
     * 1) null/empty 가드: NPE/불필요한 selectOne 방지
     * 2) Map.of는 null 값이 있으면 NPE 날 수 있으니 LinkedHashMap 사용(안전)
     */
    public Long selectOfferIdBySegments(
            SqlSessionTemplate sqlSession,
            List<FlightVo> flights
    ) {
        if (flights == null || flights.isEmpty()) {
            return null;
        }

        Map<String, Object> param = new java.util.LinkedHashMap<>();
        param.put("segments", flights);
        param.put("segmentCount", flights.size());

        return sqlSession.selectOne(
                "flightOffer.selectOfferIdBySegments",
                param
        );
    }

    /**
     * FLIGHT_OFFER INSERT 후 PK 반환
     *
     * ✅ 변경 포인트(DAO 레벨 최소화)
     * 1) insertParam null 가드
     * 2) PK 타입 방어(Number/String)
     */
    public Long insertFlightOfferAndReturnId(
            SqlSessionTemplate sqlSession,
            Map<String, Object> insertParam
    ) {
        if (insertParam == null) {
            return null;
        }

        int r = sqlSession.insert(
                "flightOffer.insertOfferAndReturnId",
                insertParam
        );

        if (r <= 0) return null;

        Object idObj = insertParam.get("flightOfferId");
        if (idObj == null) return null;

        return (idObj instanceof Number)
                ? ((Number) idObj).longValue()
                : Long.valueOf(String.valueOf(idObj));
    }
}

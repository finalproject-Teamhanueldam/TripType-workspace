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
     */
    public Long selectOfferIdBySegments(
            SqlSessionTemplate sqlSession,
            List<FlightVo> flights
    ) {

        Map<String, Object> param = Map.of(
                "segments", flights,
                "segmentCount", flights.size()
        );

        return sqlSession.selectOne(
                "flightOffer.selectOfferIdBySegments",
                param
        );
    }

    /**
     * FLIGHT_OFFER INSERT 후 PK 반환
     */
    public Long insertFlightOfferAndReturnId(
            SqlSessionTemplate sqlSession,
            Map<String, Object> insertParam
    ) {

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

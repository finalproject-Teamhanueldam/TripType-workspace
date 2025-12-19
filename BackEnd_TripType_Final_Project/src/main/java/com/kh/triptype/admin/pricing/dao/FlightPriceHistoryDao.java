package com.kh.triptype.admin.pricing.dao;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.admin.pricing.model.dto.FlightSearchRequestDto;
import com.kh.triptype.admin.pricing.model.vo.FlightSearchCacheVo;

@Repository
public class FlightPriceHistoryDao {

    /**
     * 같은 검색 조건 + 1시간 이내 검색 캐시 조회
     * - TB_FLIGHT_PRICE_HISTORY
     */
    public List<FlightSearchCacheVo> selectRecentSearchCache(
            SqlSessionTemplate sqlSession,
            FlightSearchRequestDto request) {

        return sqlSession.selectList(
                "flightPriceHistoryMapper.selectRecentSearchCache",
                request
        );
    }

    /**
     * 검색 캐시 저장
     * - TB_FLIGHT_PRICE_HISTORY
     */
    public int insertSearchCache(
            SqlSessionTemplate sqlSession,
            FlightSearchCacheVo vo) {

        return sqlSession.insert(
                "flightPriceHistoryMapper.insertSearchCache",
                vo
        );
    }
}

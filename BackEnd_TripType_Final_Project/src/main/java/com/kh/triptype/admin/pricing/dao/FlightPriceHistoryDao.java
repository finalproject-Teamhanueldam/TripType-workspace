package com.kh.triptype.admin.pricing.dao;

import java.util.ArrayList;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.admin.pricing.model.dto.FlightSearchRequestDto;
import com.kh.triptype.admin.pricing.model.vo.FlightPriceHistoryVo;

@Repository
public class FlightPriceHistoryDao {

    /**
     * 같은 검색 조건 + 1시간 이내 가격 데이터 조회
     */
    public ArrayList<FlightPriceHistoryVo> selectRecentPriceHistory(
            SqlSessionTemplate sqlSession,
            FlightSearchRequestDto request) {
    	
        return (ArrayList) sqlSession.selectList("flightPriceHistoryMapper.selectRecentPriceHistory",request);
    
    }

    /**
     * 항공권 가격 히스토리 저장
     */
    public int insertFlightPriceHistory(
            SqlSessionTemplate sqlSession,
            FlightPriceHistoryVo vo) {
    	
        return sqlSession.insert("flightPriceHistoryMapper.insertFlightPriceHistory",vo);
    
    }
    
}

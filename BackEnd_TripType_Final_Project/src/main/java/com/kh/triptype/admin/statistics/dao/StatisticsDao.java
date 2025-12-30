package com.kh.triptype.admin.statistics.dao;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.admin.statistics.model.dto.PopularRouteDto;
import com.kh.triptype.admin.statistics.model.dto.TopReviewAirlineDto;

@Repository
public class StatisticsDao {

	public List<PopularRouteDto> selectPopularRoutesTop5(SqlSessionTemplate sqlSession) {

		return sqlSession.selectList("adminStatisticsMapper.selectPopularRoutesTop5");
	}

	public List<TopReviewAirlineDto> getTopReviewAirline(SqlSessionTemplate sqlSession) {
		
		return sqlSession.selectList("adminStatisticsMapper.selectTopReviewAirline");
	}
	
	public List<TopReviewAirlineDto> getTopRatingAirline(SqlSessionTemplate sqlSession) {
		
		return sqlSession.selectList("adminStatisticsMapper.selectTopRatingAirline");
	}
}

package com.kh.triptype.admin.statistics.dao;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.admin.statistics.model.dto.PopularRouteDto;

@Repository
public class StatisticsDao {

	public List<PopularRouteDto> selectPopularRoutesTop5(SqlSessionTemplate sqlSession) {

		return sqlSession.selectList("adminStatisticsMapper.selectPopularRoutesTop5");
	}
	
	
}

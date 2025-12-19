package com.kh.triptype.admin.statistics.dao;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.admin.statistics.model.vo.PopularRouteDto;

@Repository
public class StatisticsDao {

	public List<PopularRouteDto> selectPopularRoutesTop5(SqlSessionTemplate sqlSession) {
		// TODO Auto-generated method stub
		return sqlSession.selectList("adminStatisticsMapper.selectPopularRoutesTop5");
	}
	
	
}

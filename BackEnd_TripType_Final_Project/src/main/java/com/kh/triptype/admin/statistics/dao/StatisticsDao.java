package com.kh.triptype.admin.statistics.dao;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;

import com.kh.triptype.admin.statistics.model.vo.PopularRouteDto;

public class StatisticsDao {

	public List<PopularRouteDto> selectPopularRoutesTop5(SqlSessionTemplate sqlSession) {
		// TODO Auto-generated method stub
		return (List)sqlSession.selectList("admin-Statistics-Mapper.selectPopularRoutesTop5");
	}

}

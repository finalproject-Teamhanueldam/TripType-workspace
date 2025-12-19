package com.kh.triptype.admin.statistics.service;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Service;

import com.kh.triptype.admin.statistics.dao.StatisticsDao;
import com.kh.triptype.admin.statistics.model.vo.PopularRouteDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatisticsServiceImpl implements StatisticsService {
	
	private final StatisticsDao statisticsDao;

	private final SqlSessionTemplate sqlSession;
	
	@Override
	public List<PopularRouteDto> getPopularRoutesTop5() {
		
		return statisticsDao.selectPopularRoutesTop5(sqlSession);
	}
	
	
	
}
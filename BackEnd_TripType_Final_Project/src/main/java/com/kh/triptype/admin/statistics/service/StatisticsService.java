package com.kh.triptype.admin.statistics.service;

import java.util.List;

import com.kh.triptype.admin.statistics.model.vo.PopularRouteDto;

public interface StatisticsService {
	
	List<PopularRouteDto> getPopularRoutesTop5();
	
	 String checkSessionInfo();
}

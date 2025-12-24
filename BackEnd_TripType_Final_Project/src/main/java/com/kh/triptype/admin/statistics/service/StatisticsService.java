package com.kh.triptype.admin.statistics.service;

import java.util.List;

import com.kh.triptype.admin.statistics.model.dto.PopularRouteDto;

public interface StatisticsService {
	
	List<PopularRouteDto> getPopularRoutesTop5();
	
}

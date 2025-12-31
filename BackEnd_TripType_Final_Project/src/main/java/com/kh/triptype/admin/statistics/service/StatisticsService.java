package com.kh.triptype.admin.statistics.service;

import java.util.List;

import com.kh.triptype.admin.statistics.model.dto.LoginDataDto;
import com.kh.triptype.admin.statistics.model.dto.MonthlySignUpDto;
import com.kh.triptype.admin.statistics.model.dto.PopularRouteDto;
import com.kh.triptype.admin.statistics.model.dto.TopReviewAirlineDto;

public interface StatisticsService {
	
	List<PopularRouteDto> getPopularRoutesTop5();

	List<TopReviewAirlineDto> getTopReviewAirline();

	List<TopReviewAirlineDto> getTopRatingAirline();

	LoginDataDto getLoginData();

	List<MonthlySignUpDto> getMonthlySignUpData();
	
}

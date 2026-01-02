package com.kh.triptype.airline.model.service;

import java.util.ArrayList;

import com.kh.triptype.airline.model.vo.AirlineFilter;
import com.kh.triptype.airline.model.vo.AirlineListVo;
import com.kh.triptype.airline.model.vo.Review;
import com.kh.triptype.airline.model.vo.WeeklyPrice;


public interface AirlineListService {
	
	// 가격순 정렬
	public ArrayList<AirlineListVo> selectAirlineListPrice(AirlineFilter airlineFilter);
	
	// 비행시간순 정렬
	public ArrayList<AirlineListVo> selectAirlineListDuration(AirlineFilter airlineFilter);
	
	// 늦게 출발하는순 정렬
	public ArrayList<AirlineListVo> selectAirlineListLate(AirlineFilter airlineFilter);
	
	// 주간 가격정보 불러오기
	public ArrayList<WeeklyPrice> selectWeeklyPrice(AirlineFilter airlineFilter);
	
	// 리뷰 작성
	public int writeReview(Review review);

}

package com.kh.triptype.airline.model.service;

import java.util.ArrayList;

import com.kh.triptype.airline.model.dto.ReviewRequestDto;
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
	public int writeReview(int userNo, ReviewRequestDto dto);
	
	// 리뷰 조회
	public ArrayList<Review> selectReview(int flightOfferId);
	
	// 리뷰 수정
	public int updateReview(int userNo, ReviewRequestDto dto);
	
	// 리뷰 삭제
	public int deleteReview(int userNo, ReviewRequestDto dto);
		
	// 찜 토글
    boolean toggleWish(int memberNo, long flightOfferId);

    // 찜 여부 확인
    boolean checkWish(int memberNo, long flightOfferId);
    
}

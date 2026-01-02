package com.kh.triptype.airline.model.dao;

import java.util.ArrayList;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.airline.model.vo.AirlineFilter;
import com.kh.triptype.airline.model.vo.AirlineListVo;
import com.kh.triptype.airline.model.vo.Review;
import com.kh.triptype.airline.model.vo.WeeklyPrice;

@Repository
public class AirlineListDao {

	// 가격순 정렬 DAO
	public ArrayList<AirlineListVo> selectAirlineListPrice(SqlSessionTemplate sqlSession, AirlineFilter airlineFilter) {
		return (ArrayList) sqlSession.selectList("airlineList.selectAirlineListPrice", airlineFilter);
	}
	
	// 비행 시간순 정렬
	public ArrayList<AirlineListVo> selectAirlineListDuration(SqlSessionTemplate sqlSession, AirlineFilter airlineFilter) {
		return (ArrayList) sqlSession.selectList("airlineList.selectAirlineListDuration", airlineFilter);
	}
	
	// 늦는 시간순 정렬
	public ArrayList<AirlineListVo> selectAirlineListLate(SqlSessionTemplate sqlSession, AirlineFilter airlineFilter) {
		return (ArrayList) sqlSession.selectList("airlineList.selectAirlineListLate", airlineFilter);
	}

	// 주간 가격
	public ArrayList<WeeklyPrice> selectWeeklyPrice(SqlSessionTemplate sqlSession, AirlineFilter airlineFilter) {
		return (ArrayList) sqlSession.selectList("airlineList.selectWeeklyPrice", airlineFilter);
	}

	// 리뷰 작성
//	public int writeReview(SqlSessionTemplate sqlSession, Review review) {
//		return sqlSession.insert("airlineList.writeReview", review);
//	}
	
}

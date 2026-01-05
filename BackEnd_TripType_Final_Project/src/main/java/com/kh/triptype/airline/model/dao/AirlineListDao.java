package com.kh.triptype.airline.model.dao;

import java.util.ArrayList;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.airline.model.vo.AirlineFilter;
import com.kh.triptype.airline.model.vo.AirlineListVo;
import com.kh.triptype.airline.model.vo.PriceChange;
import com.kh.triptype.airline.model.vo.Review;
import com.kh.triptype.airline.model.vo.WeeklyPrice;
import com.kh.triptype.airline.model.vo.WishList;

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
	public int writeReview(SqlSessionTemplate sqlSession, Review review) {
		return sqlSession.insert("airlineList.writeReview", review);
	}

	// 리뷰 조회
	public ArrayList<Review> selectReview(SqlSessionTemplate sqlSession, int flightOfferId) {
		return (ArrayList) sqlSession.selectList("airlineList.selectReview", flightOfferId);
	}

	// 리뷰 수정
	public int updateReview(SqlSessionTemplate sqlSession, Review review) {
		return sqlSession.update("airlineList.updateReview", review);
	}

	// 리뷰 삭제(상태값 변경)
	public int deleteReview(SqlSessionTemplate sqlSession, Review review) {
		return sqlSession.update("airlineList.deleteReview", review);
	}

	// 찜 여부 확인
	public int checkWish(SqlSessionTemplate sqlSession, WishList wish) {
		return sqlSession.selectOne("airlineList.checkWish", wish);
	}

	// 찜 추가
	public int insertWish(SqlSessionTemplate sqlSession, WishList wish) {
		return sqlSession.insert("airlineList.insertWish", wish);
	}

	// 찜 삭제
	public int deleteWish(SqlSessionTemplate sqlSession, WishList wish) {
		return sqlSession.delete("airlineList.deleteWish", wish);
	}

	// 가격 조회
	public ArrayList<PriceChange> selectPrice(SqlSessionTemplate sqlSession, PriceChange priceChange) {
		ArrayList<PriceChange> result = (ArrayList) sqlSession.selectList("airlineList.selectPrice", priceChange);
		System.out.println("result : " + result);
		return (ArrayList) sqlSession.selectList("airlineList.selectPrice", priceChange);
	}

	/* =========================================================
	   ✅ (추가) offerId 상세 조회용
	   - Controller: GET /airline/offer/{flightOfferId}
	   - Detail 새로고침/직접접근 fallback
	========================================================= */

	// offerId에 속한 세그먼트(항공편) 리스트 조회
	public ArrayList<AirlineListVo> selectOfferSegments(SqlSessionTemplate sqlSession, long flightOfferId) {
		return (ArrayList) sqlSession.selectList("airlineList.selectOfferSegments", flightOfferId);
	}

	// offerId의 tripType 조회 (DB에 없으면 null)
	public String selectOfferTripType(SqlSessionTemplate sqlSession, long flightOfferId) {
		return sqlSession.selectOne("airlineList.selectOfferTripType", flightOfferId);
	}

}

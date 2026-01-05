package com.kh.triptype.airline.model.service;

import java.util.ArrayList;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.triptype.airline.model.dao.AirlineListDao;
import com.kh.triptype.airline.model.dto.PriceChangeDto;
import com.kh.triptype.airline.model.dto.ReviewRequestDto;
import com.kh.triptype.airline.model.vo.AirlineFilter;
import com.kh.triptype.airline.model.vo.AirlineListVo;
import com.kh.triptype.airline.model.vo.PriceChange;
import com.kh.triptype.airline.model.vo.Review;
import com.kh.triptype.airline.model.vo.WeeklyPrice;
import com.kh.triptype.airline.model.vo.WishList;

@Service
public class AirlineListServiceImpl implements AirlineListService {

	@Autowired
	private AirlineListDao airlineListDao;

	@Autowired
	private SqlSessionTemplate sqlSession;

	// 가격 기준 정렬
	@Override
	public ArrayList<AirlineListVo> selectAirlineListPrice(AirlineFilter airlineFilter) {
		return airlineListDao.selectAirlineListPrice(sqlSession, airlineFilter);
	}

	// 비행시간 순 정렬
	@Override
	public ArrayList<AirlineListVo> selectAirlineListDuration(AirlineFilter airlineFilter) {
		return airlineListDao.selectAirlineListDuration(sqlSession, airlineFilter);
	}

	// 늦는 시간 순 정렬
	@Override
	public ArrayList<AirlineListVo> selectAirlineListLate(AirlineFilter airlineFilter) {
		return airlineListDao.selectAirlineListLate(sqlSession, airlineFilter);
	}

	// 주간 가격
	@Override
	public ArrayList<WeeklyPrice> selectWeeklyPrice(AirlineFilter airlineFilter) {
		return airlineListDao.selectWeeklyPrice(sqlSession, airlineFilter);
	}

	@Transactional
	// 리뷰 작성
	@Override
	public int writeReview(int memberNo, ReviewRequestDto dto) {

		Review review = new Review();

		review.setReviewContent(dto.getReviewContent());
		review.setFlightOfferId(dto.getFlightOfferId());
		review.setMemberNo(memberNo);
		review.setReviewStatus("N"); // 기본값

		System.out.println(review);

		return airlineListDao.writeReview(sqlSession, review);
	}

	// 리뷰 조회
	@Override
	public ArrayList<Review> selectReview(int flightOfferId) {
		return airlineListDao.selectReview(sqlSession, flightOfferId);
	}

	// 리뷰 수정
	@Transactional
	@Override
	public int updateReview(int memberNo, ReviewRequestDto dto) {
		Review review = new Review();

		review.setReviewNo(dto.getReviewNo());
		review.setReviewContent(dto.getReviewContent());
		review.setFlightOfferId(dto.getFlightOfferId());
		review.setMemberNo(memberNo);

		return airlineListDao.updateReview(sqlSession, review);
	}

	@Override
	public int deleteReview(int memberNo, ReviewRequestDto dto) {
		Review review = new Review();

		review.setReviewNo(dto.getReviewNo());
		review.setFlightOfferId(dto.getFlightOfferId());
		review.setMemberNo(memberNo);

		return airlineListDao.deleteReview(sqlSession, review);
	}

	// 찜 토글
	@Override
	public boolean toggleWish(int memberNo, long flightOfferId) {

		WishList wish = new WishList();
		wish.setMemberNo(memberNo);
		wish.setFlightOfferId(flightOfferId);

		int count = airlineListDao.checkWish(sqlSession, wish);

		// 이미 찜 → 삭제
		if (count > 0) {
			airlineListDao.deleteWish(sqlSession, wish);
			return false;
		}
		// 찜 안됨 → 추가
		else {
			airlineListDao.insertWish(sqlSession, wish);
			return true;
		}
	}

	// 찜 여부 확인
	@Override
	public boolean checkWish(int memberNo, long flightOfferId) {

		WishList wish = new WishList();
		wish.setMemberNo(memberNo);
		wish.setFlightOfferId(flightOfferId);

		int count = airlineListDao.checkWish(sqlSession, wish);
		return count > 0;
	}

	@Override
	public ArrayList<PriceChange> selectPrice(PriceChangeDto priceChangeDto) {
		PriceChange priceChange = new PriceChange();
		priceChange.setDepartDate(priceChangeDto.getDepartDate());
		priceChange.setArrive(priceChangeDto.getArrive());
		priceChange.setDepart(priceChangeDto.getDepart());
		priceChange.setTripType(priceChangeDto.getTripType());

		return airlineListDao.selectPrice(sqlSession, priceChange);
	}

	/* =========================================================
	   ✅ (추가) offerId 상세 조회용
	   - Controller: GET /airline/offer/{flightOfferId}
	   - Detail 새로고침/직접접근 fallback을 위해 필요
	========================================================= */

	// offerId에 속한 세그먼트(항공편) 리스트 조회
	@Override
	public ArrayList<AirlineListVo> selectOfferSegments(long flightOfferId) {
		return airlineListDao.selectOfferSegments(sqlSession, flightOfferId);
	}

	// offerId의 tripType 조회 (DB에 없으면 null 반환해도 됨)
	@Override
	public String selectOfferTripType(long flightOfferId) {
		return airlineListDao.selectOfferTripType(sqlSession, flightOfferId);
	}

}

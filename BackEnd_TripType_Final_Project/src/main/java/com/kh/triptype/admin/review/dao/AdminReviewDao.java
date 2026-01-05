package com.kh.triptype.admin.review.dao;

import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.admin.review.model.vo.AirlineReviewVo;

@Repository
public class AdminReviewDao {


	public List<AirlineReviewVo> selectAdminAirlineReview(SqlSessionTemplate sqlSession) {
		
		return sqlSession.selectList("adminAirlineReviewMapper.selectAirlineReview");
	}

	public List<AirlineReviewVo> selectAirlineReviewList(SqlSessionTemplate sqlSession, int airlineId, String status) {
		
		 return sqlSession.selectList("adminAirlineReviewMapper.selectAirlineReviewList", Map.of("airlineId", airlineId, "status", status));
	}

	public int updateReviewStatus(SqlSessionTemplate sqlSession, int reviewNo) {
		return sqlSession.update("adminAirlineReviewMapper.toggleReviewStatus",reviewNo);
		
	}
}

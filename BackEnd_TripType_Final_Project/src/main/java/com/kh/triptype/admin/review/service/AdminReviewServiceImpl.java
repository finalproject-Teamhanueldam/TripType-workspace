package com.kh.triptype.admin.review.service;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Service;

import com.kh.triptype.admin.review.dao.AdminReviewDao;
import com.kh.triptype.admin.review.model.vo.AirlineReviewVo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminReviewServiceImpl implements AdminReviewService {

	private final AdminReviewDao adminReviewDao;
	private final SqlSessionTemplate sqlSession;

	public List<AirlineReviewVo> SelectAdminAirlineReview() {
		
		return adminReviewDao.selectAdminAirlineReview(sqlSession);
	}

}

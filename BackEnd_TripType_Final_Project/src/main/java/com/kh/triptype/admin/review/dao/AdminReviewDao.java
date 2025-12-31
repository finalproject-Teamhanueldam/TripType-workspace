package com.kh.triptype.admin.review.dao;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.admin.review.model.vo.AirlineReviewVo;

@Repository
public class AdminReviewDao {


	public List<AirlineReviewVo> selectAdminAirlineReview(SqlSessionTemplate sqlSession) {
		
		return sqlSession.selectList("adminAirlineReviewMapper.selectAirlineReview");
	}

}

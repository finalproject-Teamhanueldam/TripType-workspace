package com.kh.triptype.admin.review.service;

import java.util.List;

import com.kh.triptype.admin.review.model.vo.AirlineReviewVo;

public interface AdminReviewService {

	List<AirlineReviewVo> SelectAdminAirlineReview();
	
	List<AirlineReviewVo> selectAirlineReviewList(int airlineId, String status);
	
	void updateReviewStatus(int reviewNo);
}

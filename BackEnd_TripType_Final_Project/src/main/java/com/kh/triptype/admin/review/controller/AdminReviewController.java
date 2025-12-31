package com.kh.triptype.admin.review.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.admin.review.model.vo.AirlineReviewVo;
import com.kh.triptype.admin.review.service.AdminReviewService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("/admin/review")
public class AdminReviewController {
	
	private final AdminReviewService adminReviewService;

	@GetMapping("/airlineReviews")
	public List<AirlineReviewVo> SelectAdminAirlineReview() {
		
		List list =  adminReviewService.SelectAdminAirlineReview();
		System.out.println(list);
		return list;
	}
}

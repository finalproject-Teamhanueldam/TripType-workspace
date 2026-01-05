package com.kh.triptype.admin.review.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
	
		return list;
	}
	
	  @GetMapping("/airline/{airlineId}")
	    public List<AirlineReviewVo> selectAirlineReviewList(
	            @PathVariable int airlineId,
	            @RequestParam(defaultValue = "Y") String status
	    ) {
	        return adminReviewService.selectAirlineReviewList(airlineId, status);
	    }
	  
	  @PostMapping("/status")
	    public ResponseEntity<Void> toggleReviewStatus(
	            @RequestBody Map<String, Integer> param
	    ) {
	        int reviewNo = param.get("reviewId");
	        adminReviewService.updateReviewStatus(reviewNo);
	        return ResponseEntity.ok().build();
	    }
}

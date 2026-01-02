package com.kh.triptype.airline.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.airline.model.dto.ReviewRequestDto;
import com.kh.triptype.airline.model.service.AirlineListService;
import com.kh.triptype.airline.model.vo.AirlineFilter;
import com.kh.triptype.airline.model.vo.AirlineListVo;
import com.kh.triptype.airline.model.vo.Review;
import com.kh.triptype.airline.model.vo.WeeklyPrice;
import com.kh.triptype.auth.model.vo.AuthUser;

@RequestMapping("airline")
@RestController
@CrossOrigin(origins="http://localhost:5173")
public class AirlineListController {
	
	@Autowired
	private AirlineListService airlineListService;
	
	// sortType에 따른 최저가순/비행시간순/늦는시간순 으로 정렬 호출
	@GetMapping("list")
	public ArrayList<AirlineListVo> selectAirlineList(@ModelAttribute AirlineFilter filter) {
		
		ArrayList<AirlineListVo> list = null;
		
		String tripType = filter.getTripType();
		String sortType = filter.getSortType();
		
		switch(tripType) {
		case "ROUND" : filter.setTripType("N"); break;
		case "ONEWAY" : filter.setTripType("Y"); break;
		}

		
		switch(sortType) {
			case "PRICE" : 
				list = airlineListService.selectAirlineListPrice(filter);
				break;
			case "DURATION" : 
				list = airlineListService.selectAirlineListDuration(filter);
				break;
			case "LATE" : 
				list = airlineListService.selectAirlineListLate(filter);
				break;
		}
		
		 
		
		if(list.isEmpty()) {
			System.out.println("empty");
		} 
		else {
			for(AirlineListVo item : list) {
				System.out.println(item);
				double money = item.getTotalPrice();
				double won = (money * 1692);			
				item.setTotalPrice(won);
			}
		}
		
		return list;
	}
	
	// 주간 최저가 가격
	@GetMapping("weeklyPrice")
	public ArrayList<WeeklyPrice> selectWeeklyPrice(AirlineFilter filter) {
		
		System.out.println("weeklyPrice 호출");
		System.out.println(filter);
		
		String tripType = filter.getTripType();
		
		switch(tripType) {
		case "ROUND" : filter.setTripType("N"); break;
		case "ONEWAY" : filter.setTripType("Y"); break;
		}
		
		System.out.println("변경 후 : " + filter);
		
		ArrayList<WeeklyPrice> list = null;
		
		list = airlineListService.selectWeeklyPrice(filter);
		
		if(!list.isEmpty()) {
			for(WeeklyPrice item : list) {
				double money = item.getOfferPriceTotal();
				double won = (money * 1692);
				item.setOfferPriceTotal(won);
			}
		} else {
			System.out.println("empty");
		}
	
		return list;
	}
	
	// 댓글 작성
	@PostMapping("review")
	public ResponseEntity<?> writeReview(
	        @AuthenticationPrincipal AuthUser authUser,
	        @RequestBody ReviewRequestDto dto) {
	    airlineListService.writeReview(authUser.getMemberNo(), dto);
	    return ResponseEntity.ok().build();
	}
	
	@GetMapping("review/select")
	public ArrayList<Review> selectReview(@RequestParam int flightOfferId) {
	    ArrayList<Review> reviews = airlineListService.selectReview(flightOfferId);

	    if (reviews.isEmpty()) {
	        System.out.println("empty");
	    } else {
	        reviews.forEach(System.out::println);
	    }

	    return reviews;
	}

	
	
}

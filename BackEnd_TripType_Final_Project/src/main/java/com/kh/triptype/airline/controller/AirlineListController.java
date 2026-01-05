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

import com.kh.triptype.airline.model.dto.PriceChangeDto;
import com.kh.triptype.airline.model.dto.ReviewRequestDto;
import com.kh.triptype.airline.model.dto.WishListDto;
import com.kh.triptype.airline.model.service.AirlineListService;
import com.kh.triptype.airline.model.vo.AirlineFilter;
import com.kh.triptype.airline.model.vo.AirlineListVo;
import com.kh.triptype.airline.model.vo.PriceChange;
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
		System.out.println("filter" + filter);
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
				System.out.println("목록 조회 리스트 : " + item);
				double money = item.getTotalPrice();
				double won = (money * 1690);			
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
		
		ArrayList<WeeklyPrice> list = null;
		
		list = airlineListService.selectWeeklyPrice(filter);
		
		if(!list.isEmpty()) {
			for(WeeklyPrice item : list) {
				double money = item.getOfferPriceTotal();
				double won = (money * 1690);
				item.setOfferPriceTotal(won);
			}
		} else {
			System.out.println("empty");
		}
	
		return list;
	}
	
	// 리뷰 작성
	@PostMapping("review")
	public ResponseEntity<?> writeReview(
	        @AuthenticationPrincipal AuthUser authUser,
	        @RequestBody ReviewRequestDto dto) {
	    airlineListService.writeReview(authUser.getMemberNo(), dto);
	    return ResponseEntity.ok().build();
	}
	
	// 리뷰 조회
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
	
	// 리뷰 수정
	@PostMapping("review/update")
	public String updateReview(@AuthenticationPrincipal AuthUser authUser, @RequestBody ReviewRequestDto dto) {
		int result = airlineListService.updateReview(authUser.getMemberNo(), dto);
		String text = "";
		
		if(result > 0) {
			text = "수정이 완료되었습니다.";
		} else {
			text = "수정 실패";
		}
		return text;
	}

	
	// 리뷰 삭제
	@PostMapping("review/delete")
	public String deleteReview(@AuthenticationPrincipal AuthUser authUser, @RequestBody ReviewRequestDto dto) {
		int result = airlineListService.deleteReview(authUser.getMemberNo(), dto);
		String text = "";
		
		if(result > 0) {
			text = "댓글이 삭제되었습니다.";
		} else {
			text = "댓글이 삭제 실패";
		}
		return text;
	}
	
	
	
	// 찜 추가 / 해제 (토글)
	@PostMapping("wish/toggle")
	public boolean toggleWish(
	        @AuthenticationPrincipal AuthUser authUser,
	        @RequestBody WishListDto dto
	) {
	    int memberNo = authUser.getMemberNo();
	    long flightOfferId = dto.getFlightOfferId();

	    return airlineListService.toggleWish(memberNo, flightOfferId);
	}

	
	
	// 찜 여부 조회 (페이지 진입 시)
	@GetMapping("wish/check")
	public boolean checkWish(
	        @AuthenticationPrincipal AuthUser authUser,
	        @RequestParam long flightOfferId
	) {
	    int memberNo = authUser.getMemberNo();
	    return airlineListService.checkWish(memberNo, flightOfferId);
	}
	
	
	// 가격 변동 조회
	@GetMapping("select/price")
	public ArrayList<PriceChange> getPriceChange(PriceChangeDto priceChangeDto) {
		System.out.println("조회 : " + priceChangeDto);
		
		switch(priceChangeDto.getTripType()) {
		case "ROUND" : priceChangeDto.setTripType("N"); break;
		case "ONEWAY" : priceChangeDto.setTripType("Y"); break;
		}
		
		System.out.println("조회 변경 후 : " + priceChangeDto);
		
		 ArrayList<PriceChange> list = airlineListService.selectPrice(priceChangeDto);
		 
		 if(!list.isEmpty()) {
			 for(PriceChange item : list) {
				 System.out.println("날짜별 최저가 가격 : " + item);
			 }
		 } else {
			 System.out.println("empty");
		 }
		 
		 return list;
	}
	
	

	
}

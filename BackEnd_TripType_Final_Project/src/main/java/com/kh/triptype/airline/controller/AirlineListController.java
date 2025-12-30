package com.kh.triptype.airline.controller;

import java.text.DecimalFormat;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.airline.model.service.AirlineListService;
import com.kh.triptype.airline.model.vo.AirlineFilter;
import com.kh.triptype.airline.model.vo.AirlineListVo;

@RequestMapping("airline")
@RestController
@CrossOrigin(origins="http://localhost:5173")
public class AirlineListController {
	
	@Autowired
	private AirlineListService airlineListService;
	
	// sortType에 따른 최저가순/비행시간순/늦는시간순 으로 정렬 호출
	@GetMapping("list")
	public ArrayList<AirlineListVo> selectAirlineList(@ModelAttribute AirlineFilter filter) {
		System.out.println("호출 : " + filter);
		
		ArrayList<AirlineListVo> list = null;
		
		String tripType = filter.getTripType();
		String sortType = filter.getSortType();
		
		switch(tripType) {
		case "ROUND" : filter.setTripType("N"); break;
		case "ONEWAY" : filter.setTripType("Y"); break;
		}
		
		System.out.println(filter);
		
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
				int money = item.getTotalPrice();
				int won = (money * 1690);			
				item.setTotalPrice(won);
			}
		}
		
		return list;
	}
	
	// 비행시간 순으로 호출
	
}

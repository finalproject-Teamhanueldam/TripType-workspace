package com.kh.triptype.airline.controller;

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
	
	@GetMapping("list")
	public ArrayList<AirlineListVo> selectAirlineList(@ModelAttribute AirlineFilter filter) {
		System.out.println("호출 : " + filter);
		
		String tripType = filter.getTripType();
		
		switch(tripType) {
		case "ROUND" : filter.setTripType("N"); break;
		case "ONEWAY" : filter.setTripType("Y"); break;
		}
		
		System.out.println(filter);
		
		ArrayList<AirlineListVo> list = airlineListService.selectAirlineList(filter);
		
		if(list.isEmpty()) {
			System.out.println("empty");
		} else {
			for(AirlineListVo item : list) {
				System.out.println(item);
			}
		}
		
		return list;
	}
	
}

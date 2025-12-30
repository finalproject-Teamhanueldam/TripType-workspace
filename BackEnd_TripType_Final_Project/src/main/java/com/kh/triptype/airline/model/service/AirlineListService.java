package com.kh.triptype.airline.model.service;

import java.util.ArrayList;

import com.kh.triptype.airline.model.vo.AirlineFilter;
import com.kh.triptype.airline.model.vo.AirlineListVo;


public interface AirlineListService {
	
	public ArrayList<AirlineListVo> selectAirlineListPrice(AirlineFilter airlineFilter);
	
	public ArrayList<AirlineListVo> selectAirlineListDuration(AirlineFilter airlineFilter);
	
	public ArrayList<AirlineListVo> selectAirlineListLate(AirlineFilter airlineFilter);

}

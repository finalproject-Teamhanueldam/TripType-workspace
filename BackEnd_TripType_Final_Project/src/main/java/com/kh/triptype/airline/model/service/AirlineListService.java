package com.kh.triptype.airline.model.service;

import java.util.ArrayList;

import com.kh.triptype.airline.model.vo.AirlineFilter;
import com.kh.triptype.airline.model.vo.AirlineListVo;


public interface AirlineListService {
	
	public ArrayList<AirlineListVo> selectAirlineList(AirlineFilter airlineFilter);

}

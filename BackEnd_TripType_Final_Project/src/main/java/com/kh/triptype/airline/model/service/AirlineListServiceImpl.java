package com.kh.triptype.airline.model.service;

import java.util.ArrayList;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kh.triptype.airline.model.dao.AirlineListDao;
import com.kh.triptype.airline.model.vo.AirlineFilter;
import com.kh.triptype.airline.model.vo.AirlineListVo;

@Service
public class AirlineListServiceImpl implements AirlineListService {
	
	@Autowired
	private AirlineListDao airlineListDao;
	
	@Autowired
	private SqlSessionTemplate sqlSession;

	@Override
	public ArrayList<AirlineListVo> selectAirlineList(AirlineFilter airlineFilter) {
		return airlineListDao.selectAirlineList(sqlSession, airlineFilter);
	}

}

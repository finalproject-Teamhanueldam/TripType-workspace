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

	// 가격 기준 정렬
	@Override
	public ArrayList<AirlineListVo> selectAirlineListPrice(AirlineFilter airlineFilter) {
		return airlineListDao.selectAirlineListPrice(sqlSession, airlineFilter);
	}
	
	// 비행시간 순 정렬
	@Override
	public ArrayList<AirlineListVo> selectAirlineListDuration(AirlineFilter airlineFilter) {
		return airlineListDao.selectAirlineListDuration(sqlSession, airlineFilter);
	}

	// 늦는 시간 순 정렬
	@Override
	public ArrayList<AirlineListVo> selectAirlineListLate(AirlineFilter airlineFilter) {
		return airlineListDao.selectAirlineListLate(sqlSession, airlineFilter);
	}

}

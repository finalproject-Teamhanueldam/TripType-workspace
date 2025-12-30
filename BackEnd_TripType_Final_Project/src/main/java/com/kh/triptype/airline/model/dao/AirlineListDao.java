package com.kh.triptype.airline.model.dao;

import java.util.ArrayList;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.airline.model.vo.AirlineFilter;
import com.kh.triptype.airline.model.vo.AirlineListVo;

@Repository
public class AirlineListDao {

	public ArrayList<AirlineListVo> selectAirlineList(SqlSessionTemplate sqlSession, AirlineFilter airlineFilter) {
		return (ArrayList) sqlSession.selectList("airlineList.selectAirlineList", airlineFilter);
	}
	
	
	
}

package com.kh.triptype.admin.flight.dao;

import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;

import com.kh.triptype.admin.flight.model.dto.FlightHistoryInsertDto;
import com.kh.triptype.admin.flight.model.dto.FlightInsertDto;
import com.kh.triptype.admin.flight.model.dto.FlightOfferInsertDto;

public class AdminFlightDao {

	public void InsertFlightOffer(SqlSessionTemplate sqlSession, FlightOfferInsertDto offerDto) {
		
		sqlSession.insert("adminFlightOfferMapper.InsertFlightOffer", offerDto);
	}

	public void insertFlight(SqlSessionTemplate sqlSession, FlightInsertDto flightDto) {
		
		sqlSession.insert("adminFlightMapper.InsertFlight", flightDto);
		
	}

	public void InsertFlightHistory(SqlSessionTemplate sqlSession, FlightHistoryInsertDto history) {
		
		sqlSession.insert("adminFlightHistory.InsertFlightHistory", history);
		
	}

};

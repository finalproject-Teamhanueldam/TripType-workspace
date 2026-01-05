package com.kh.triptype.admin.flight.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.admin.flight.model.dto.AdminTicketOfferDto;
import com.kh.triptype.admin.flight.model.dto.FlightHistoryInsertDto;
import com.kh.triptype.admin.flight.model.dto.FlightInsertDto;
import com.kh.triptype.admin.flight.model.dto.FlightOfferInsertDto;

@Repository
public class AdminFlightDao {

	public void InsertFlightOffer(SqlSessionTemplate sqlSession, FlightOfferInsertDto offerDto) {
		
		sqlSession.insert("adminFlightOfferMapper.InsertFlightOffer", offerDto);
	}

	public void insertFlight(SqlSessionTemplate sqlSession, FlightInsertDto flightDto) {
		
		sqlSession.insert("adminFlightMapper.InsertFlight", flightDto);
		
	}

	public void InsertFlightHistory(SqlSessionTemplate sqlSession, FlightHistoryInsertDto history) {
		
		sqlSession.insert("adminFlightHistoryMapper.InsertFlightHistory", history);
		
	}
	
	public List<String> SelectAirlineIata(SqlSessionTemplate sqlSession) {
		
		return sqlSession.selectList("adminAirlineMapper.selectAllAirlineIata");
	}

	public Map<String, Integer> selectAirlineIataIdMap(SqlSessionTemplate sqlSession) {

	    List<Map<String, Object>> list =
	        sqlSession.selectList("adminAirlineMapper.selectAirlineIataIdList");

	    Map<String, Integer> result = new HashMap<>();

	    for (Map<String, Object> row : list) {
	        String iata = (String) row.get("AIRLINE_IATA_CODE");
	        Integer id = ((Number) row.get("AIRLINE_ID")).intValue();
	        result.put(iata, id);
	    }

	    return result;
	}

	public int exists(SqlSessionTemplate sqlSession, String iata) {
	
		return sqlSession.selectOne("adminAirportMapper.selectAirportIata", iata);
	}

	public void insertMinimal(SqlSessionTemplate sqlSession, String iata) {
		
		sqlSession.insert("adminAirportMapper.insertAirportIata", iata);
		
	}

	public List<AdminTicketOfferDto> selectTickets(SqlSessionTemplate sqlSession) {
		// TODO Auto-generated method stub
		return sqlSession.selectList("adminTicketMapper.selectTickets");
	}

	/*
    public void updateFlightHistoryIsDelByOfferId(
            SqlSessionTemplate sqlSession,
            List<Long> offerIds
    ) {
        sqlSession.update("adminFlighHistorytMapper.updateFlightHistoryIsDelByOfferId", offerIds);
    }
    */
    

    public void updateFlightIsDelByOfferId(
            SqlSessionTemplate sqlSession,
            List<Long> offerIds
    ) {
        sqlSession.update("adminFlightMapper.updateFlightIsDelByOfferId", offerIds);
    }
    

    public void updateFlightOfferIsDel(
            SqlSessionTemplate sqlSession,
            List<Long> offerIds
    ) {
        sqlSession.update("adminFlightOfferMapper.updateFlightOfferIsDel",offerIds);
    }
    
 



};

	

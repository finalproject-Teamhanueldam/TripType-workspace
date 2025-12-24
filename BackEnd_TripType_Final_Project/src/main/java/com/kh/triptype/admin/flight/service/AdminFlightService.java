package com.kh.triptype.admin.flight.service;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import com.kh.triptype.admin.flight.model.dto.FlightHistoryInsertDto;
import com.kh.triptype.admin.flight.model.dto.FlightInsertDto;
import com.kh.triptype.admin.flight.model.dto.FlightOfferInsertDto;

public interface AdminFlightService {

	// 항공권 API 조회 
	// 전체 결과가 여러건 이므로 List(index 있으니까)로 감싸고 받고 
	// API 데이터가 key-value 세트로 나오니 Map을 사용한다
	// 키 값이 문자열 이므로 String, 밸류값은 숫자/문자열/날짜 등등 다양한 타입일 수 있어서 Object
	// 이 파라미터 값들은 API 요청시 항공권을 특정할 수 있는 최소한의 조건만 전달
	// 출발지, 도착지, 출발시각, 인원수 만 요청 하면 된다 
	// 내가 필요로 하는 정보(조회할때 가격이 필요하고, INSERT, UPDATE 시 필요한 정보)는 Map에 다 담겨온다.
	List<Map<String, Object>> fetchFlightOffers(
		String departAirport,
		String destAirport,
		String flightDepartDate,
		String flightReturnDate,
		int adultCount, // 인원수 
		// DB에도 1인 기준으로 저장할거고 관리자 - 항공권 관리 페이지에서도 1인 기준으로 저장, 조회하지만
		// 인원수는 외부 API에서 조회할 가격을 계산하기 위해서 요청 파라미터에 넣어야 한다. 인원수는 1로 고정
		String token
		);

	List<Map<String, Object>> collectByPopularTop5();

	void saveAdminFlightOffers(List<Map<String, Object>> result);
	
	FlightOfferInsertDto parseFlightOffer(Map<String, Object> offer);
	
	List<FlightInsertDto> parseFlights(
	        Map<String, Object> offer,
	        int offerId
	    );
	
	FlightHistoryInsertDto parseFlightHistory(
	        FlightOfferInsertDto offerDto,
	        Map<String, Object> offer
	);
}

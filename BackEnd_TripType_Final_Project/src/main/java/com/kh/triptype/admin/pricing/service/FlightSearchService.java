package com.kh.triptype.admin.pricing.service;

import java.util.List;

import com.kh.triptype.admin.pricing.model.dto.FlightSearchRequestDto;
import com.kh.triptype.admin.pricing.model.dto.FlightSearchResponseDto;
import com.kh.triptype.airline.model.vo.AirlineListVo;


/**
 * 항공권 검색 서비스
 * - 사용자 검색 요청 처리
 * - 캐시(DB) 조회
 * - 외부 항공 API 호출 여부 판단
 */
public interface FlightSearchService {

    /**
     * 항공권 검색
     *
     * @param request 사용자 검색 조건 DTO
     * @return 항공권 검색 결과
     */
    FlightSearchResponseDto searchFlights(FlightSearchRequestDto request);

    
    // ✅ 이거 추가
    List<AirlineListVo> searchFlightsForList(FlightSearchRequestDto request);
    String startSearchAsync(FlightSearchRequestDto request);

    List<AirlineListVo> getSearchResult(String searchId);

}

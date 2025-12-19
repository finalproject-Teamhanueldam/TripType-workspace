package com.kh.triptype.admin.pricing.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 다구간 항공편 구간 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightSegmentDto {

    /** 출발지 (IATA 코드) */
    private String depart;

    /** 도착지 (IATA 코드) */
    private String arrive;

    /** 출발일 (yyyy-MM-dd) */
    private String date;
}

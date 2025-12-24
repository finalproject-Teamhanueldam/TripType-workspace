package com.kh.triptype.admin.pricing.model.dto;

import java.time.OffsetDateTime;
import lombok.Data;

/**
 * 외부 API 응답 기반 항공편 세그먼트 DTO
 * - Amadeus 응답 파싱 전용
 */
@Data
public class FlightSegmentApiDto {

    /** 세그먼트 순번 */
    private int segmentNo;

    /** 항공편 번호 (KE123 등) */
    private String flightNumber;

    /** 출발 공항 IATA */
    private String departIataCode;

    /** 도착 공항 IATA */
    private String arriveIataCode;

    /** 출발 시각 */
    private OffsetDateTime departAt;

    /** 도착 시각 */
    private OffsetDateTime arriveAt;

    /** 세그먼트 소요 시간 (PT2H35M) */
    private String duration;

    /** 가는편(O) / 오는편(I) */
    private String direction;

    /** 실제 운항 항공사 코드 */
    private String operatingCarrierCode;

    /** 판매 항공사 코드 */
    private String sellingCarrierCode;
}

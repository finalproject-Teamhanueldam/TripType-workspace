package com.kh.triptype.admin.flight.model.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminFlightSegmentDto {

    /** 출발 일시 */
    private LocalDateTime departDateTime;

    /** 도착 일시 */
    private LocalDateTime arriveDateTime;

    /** 출발 공항 코드 */
    private String departAirport;

    /** 도착 공항 코드 */
    private String arriveAirport;

    /** 소요 시간 (PT2H20M) */
    private String duration;
}

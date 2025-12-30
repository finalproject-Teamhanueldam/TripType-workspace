package com.kh.triptype.admin.pricing.model.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.kh.triptype.admin.pricing.model.vo.FlightPriceHistoryVo;
import com.kh.triptype.admin.pricing.model.vo.FlightSearchCacheVo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 항공권 검색 응답 DTO
 * - 단일/왕복(DB)
 * - 캐시(TB_FLIGHT_PRICE_HISTORY)
 * - 다구간(API)
 * 공통 응답
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightSearchResponseDto {

    /** 프론트에 내려줄 항공권 목록 */
    private List<FlightOfferResultDto> flightList;

    /* ===============================
       🔹 DB (TB_FLIGHT_OFFER) → 응답 DTO
       =============================== */
    public static FlightSearchResponseDto from(
            List<FlightPriceHistoryVo> list
    ) {

        List<FlightOfferResultDto> result = new ArrayList<>();

        if (list != null) {
            for (FlightPriceHistoryVo vo : list) {

                if (vo == null) continue;

                result.add(
                    FlightOfferResultDto.builder()
                        .flightOfferId(vo.getFlightOfferId())
                        .priceTotal(
                            vo.getFlightOfferPriceTotal() != null
                                ? vo.getFlightOfferPriceTotal().toString()
                                : null
                        )
                        .currency(vo.getFlightOfferCurrency())
                        .oneWay(vo.getFlightOfferOneWay())
                        .departDate(
                            vo.getFlightOfferDepartDate() != null
                                ? vo.getFlightOfferDepartDate().toString()
                                : null
                        )
                        .returnDate(
                            vo.getFlightOfferReturnDate() != null
                                ? vo.getFlightOfferReturnDate().toString()
                                : null
                        )
                        // 🔥 int 이므로 null 체크 금지
                        .airlineId(vo.getAirlineId())
                        .apiQueryDate(
                            vo.getFlightOfferApiQueryDate() != null
                                ? vo.getFlightOfferApiQueryDate().toString()
                                : null
                        )
                        .build()
                );
            }
        }

        return FlightSearchResponseDto.builder()
                .flightList(result)
                .build();
    }

    /* ===============================
       🔹 캐시 (TB_FLIGHT_PRICE_HISTORY) → 응답 DTO
       =============================== */
    public static FlightSearchResponseDto fromCache(
            List<FlightSearchCacheVo> list
    ) {

        List<FlightOfferResultDto> result = new ArrayList<>();

        if (list == null || list.isEmpty()) {
            return FlightSearchResponseDto.builder()
                    .flightList(result)
                    .build();
        }

        for (FlightSearchCacheVo vo : list) {

            // 🔥 null row 방어
            if (vo == null) continue;

            result.add(
                FlightOfferResultDto.builder()
                    .flightOfferId(vo.getFlightOfferId())
                    .priceTotal(
                        vo.getFlightOfferPriceTotal() != null
                            ? vo.getFlightOfferPriceTotal().toString()
                            : null
                    )
                    .currency(vo.getFlightOfferCurrency())
                    .oneWay(vo.getFlightOfferOneWay())
                    .departDate(
                        vo.getFlightOfferDepartDate() != null
                            ? vo.getFlightOfferDepartDate().toString()
                            : null
                    )
                    .returnDate(
                        vo.getFlightOfferReturnDate() != null
                            ? vo.getFlightOfferReturnDate().toString()
                            : null
                    )
                    // 🔥 int 이므로 null 체크 금지
                    .airlineId(vo.getAirlineId())
                    .apiQueryDate(
                        vo.getFlightOfferApiQueryDate() != null
                            ? vo.getFlightOfferApiQueryDate().toString()
                            : null
                    )
                    .build()
            );
        }

        return FlightSearchResponseDto.builder()
                .flightList(result)
                .build();
    }

    /* ===============================
       🔹 외부 API (MULTI) → 응답 DTO
       =============================== */
    @SuppressWarnings("unchecked")
    public static FlightSearchResponseDto fromApi(
            List<Map<String, Object>> apiData
    ) {

        List<FlightOfferResultDto> result = new ArrayList<>();

        if (apiData == null || apiData.isEmpty()) {
            return FlightSearchResponseDto.builder()
                    .flightList(result)
                    .build();
        }

        for (Map<String, Object> item : apiData) {

            if (item == null) continue;

            Map<String, Object> price =
                    (Map<String, Object>) item.get("price");

            if (price == null) continue;

            result.add(
                FlightOfferResultDto.builder()
                    .flightOfferId(0) // MULTI는 DB 저장 안 함
                    .priceTotal(
                        price.get("total") != null
                            ? String.valueOf(price.get("total"))
                            : null
                    )
                    .currency(
                        price.get("currency") != null
                            ? String.valueOf(price.get("currency"))
                            : null
                    )
                    .oneWay("N")
                    .departDate(null)
                    .returnDate(null)
                    .airlineId(0)
                    .apiQueryDate(java.time.LocalDate.now().toString())
                    .build()
            );
        }

        return FlightSearchResponseDto.builder()
                .flightList(result)
                .build();
    }
}

package com.kh.triptype.admin.pricing.model.dto;

import java.math.BigDecimal;
import java.util.List;

import com.kh.triptype.admin.pricing.model.vo.FlightVo;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ParsedOfferDto {
    private List<FlightVo> flights;
    private BigDecimal totalPrice;
    private String currency;
}

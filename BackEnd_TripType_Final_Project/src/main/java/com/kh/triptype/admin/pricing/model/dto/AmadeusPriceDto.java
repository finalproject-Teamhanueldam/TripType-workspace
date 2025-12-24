package com.kh.triptype.admin.pricing.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AmadeusPriceDto {
    private String total;
    private String currency;
    private String base;   // 있어도 안 써도 됨
}

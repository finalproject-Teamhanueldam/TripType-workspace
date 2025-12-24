package com.kh.triptype.admin.pricing.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AmadeusSegmentDto {
    private AmadeusLocationDto departure;
    private AmadeusLocationDto arrival;
    private String carrierCode;
    private String number;
    private String duration;
}

package com.kh.triptype.admin.pricing.model.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AmadeusItineraryDto {
    private List<AmadeusSegmentDto> segments;
}

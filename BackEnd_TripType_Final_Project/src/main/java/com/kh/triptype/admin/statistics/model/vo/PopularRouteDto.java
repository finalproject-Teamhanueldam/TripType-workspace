package com.kh.triptype.admin.statistics.model.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PopularRouteDto {
	
	private String departIata;
	private String arriveIata;
	private int searchCount;
}

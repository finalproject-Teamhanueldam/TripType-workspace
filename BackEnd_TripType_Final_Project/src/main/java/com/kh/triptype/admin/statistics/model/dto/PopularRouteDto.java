package com.kh.triptype.admin.statistics.model.dto;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Alias("PopularRouteDto")
public class PopularRouteDto {
	
	private String departIata;
	private String arriveIata;
	private int searchCount;
	private Date departDate;
	
}

// ✅ TrendService.java
package com.kh.triptype.trend.service;

import java.util.List;

import com.kh.triptype.trend.model.dto.TrendPriceMoveDto;
import com.kh.triptype.trend.model.dto.TrendRouteDto;
import com.kh.triptype.trend.model.dto.TrendSurgeDto;

public interface TrendService {

    // ✅ 인기 검색 노선
    List<TrendRouteDto> getPopularRoutes(int days, int limit);

    // ✅ 최근 가격 변동 노선
    List<TrendPriceMoveDto> getPriceMoves(int days, int limit);

    // ✅ 최근 검색 급증 노선
    List<TrendSurgeDto> getSurgeRoutes(int days, int limit);
}

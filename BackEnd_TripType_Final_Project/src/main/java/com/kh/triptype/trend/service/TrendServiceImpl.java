// ✅ TrendServiceImpl.java
package com.kh.triptype.trend.service;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Service;

import com.kh.triptype.trend.dao.TrendDao;
import com.kh.triptype.trend.model.dto.TrendPriceMoveDto;
import com.kh.triptype.trend.model.dto.TrendRouteDto;
import com.kh.triptype.trend.model.dto.TrendSurgeDto;

@Service
public class TrendServiceImpl implements TrendService {

    private final SqlSessionTemplate sqlSession;
    private final TrendDao trendDao;

    public TrendServiceImpl(SqlSessionTemplate sqlSession, TrendDao trendDao) {
        this.sqlSession = sqlSession;
        this.trendDao = trendDao;
    }

    @Override
    public List<TrendRouteDto> getPopularRoutes(int days, int limit) {
        int safeDays = (days <= 0 ? 7 : Math.min(days, 90));
        int safeLimit = (limit <= 0 ? 3 : Math.min(limit, 10));
        return trendDao.selectPopularRoutes(sqlSession, safeDays, safeLimit);
    }

    @Override
    public List<TrendPriceMoveDto> getPriceMoves(int days, int limit) {
        int safeDays = (days <= 0 ? 7 : Math.min(days, 90));
        int safeLimit = (limit <= 0 ? 1 : Math.min(limit, 10));
        return trendDao.selectPriceMoves(sqlSession, safeDays, safeLimit);
    }

    @Override
    public List<TrendSurgeDto> getSurgeRoutes(int days, int limit) {
        int safeDays = (days <= 0 ? 1 : Math.min(days, 90));
        int safeLimit = (limit <= 0 ? 1 : Math.min(limit, 10));
        return trendDao.selectSurgeRoutes(sqlSession, safeDays, safeLimit);
    }
}

// ✅ TrendDao.java
package com.kh.triptype.trend.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.trend.model.dto.TrendPriceMoveDto;
import com.kh.triptype.trend.model.dto.TrendRouteDto;
import com.kh.triptype.trend.model.dto.TrendSurgeDto;

@Repository
public class TrendDao {

    /**
     * ✅ 인기 검색 노선
     */
    public List<TrendRouteDto> selectPopularRoutes(
            SqlSessionTemplate sqlSession,
            int days,
            int limit
    ) {
        Map<String, Object> param = new HashMap<>();
        param.put("days", days);
        param.put("limit", limit);

        // namespace = trendMapper
        return sqlSession.selectList(
                "trendMapper.selectPopularRoutes",
                param
        );
    }

    /**
     * ✅ 최근 가격 변동 노선
     */
    public List<TrendPriceMoveDto> selectPriceMoves(
            SqlSessionTemplate sqlSession,
            int days,
            int limit
    ) {
        Map<String, Object> param = new HashMap<>();
        param.put("days", days);
        param.put("limit", limit);

        return sqlSession.selectList(
                "trendMapper.selectPriceMoves",
                param
        );
    }

    /**
     * ✅ 최근 검색 급증 노선
     */
    public List<TrendSurgeDto> selectSurgeRoutes(
            SqlSessionTemplate sqlSession,
            int days,
            int limit
    ) {
        Map<String, Object> param = new HashMap<>();
        param.put("days", days);
        param.put("limit", limit);

        return sqlSession.selectList(
                "trendMapper.selectSurgeRoutes",
                param
        );
    }
}

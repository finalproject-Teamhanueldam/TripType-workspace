package com.kh.triptype.admin.pricing.dao;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.admin.pricing.model.vo.FlightSearchHistoryVo;

/**
 * 항공권 검색 기록 DAO
 * - 사용자 검색 시 검색 로그 저장
 *
 * ✅ 수정 원칙
 * - 팀원 조회 로직과 완전히 분리
 * - 기존 매퍼/서비스 흐름 유지
 * - 속도 개선을 위해 불필요한 NPE·실행 방지 가드만 추가
 */
@Repository
public class FlightSearchHistoryDao {

    public int insertSearchHistory(
            SqlSessionTemplate sqlSession,
            FlightSearchHistoryVo historyVo
    ) {

        if (historyVo == null) {
            System.out.println("🟥 [insertSearchHistory] historyVo is null -> skip");
            return 0;
        }

        long t0 = System.currentTimeMillis();
        System.out.println("🟦 [insertSearchHistory] START t=" + t0);
        System.out.println("🟦 [insertSearchHistory] vo=" + historyVo);

        try {
            int r = sqlSession.insert(
                    "flightSearchHistoryMapper.insertSearchHistory",
                    historyVo
            );
            long t1 = System.currentTimeMillis();
            System.out.println("🟩 [insertSearchHistory] END r=" + r + " elapsed=" + (t1 - t0) + "ms");
            return r;

        } catch (Exception e) {
            long t1 = System.currentTimeMillis();
            System.out.println("🟥 [insertSearchHistory] ERROR elapsed=" + (t1 - t0) + "ms msg=" + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}


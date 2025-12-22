package com.kh.triptype;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 공통 엔트리포인트
 * - 기본 스캔은 "DB 비의존 기능"만 포함
 * - DB 기능은 DbFeatureConfig에서 조건부로 스캔
 */
@SpringBootApplication(
    scanBasePackages = {
        // ✅ DB 안 쓰는 패키지들만
        "com.kh.triptype.travelAlert",
        "com.kh.triptype.common"   // 공통 유틸 있으면
        // ❌ member / admin / statistics 등은 여기 넣지 않음
    }
)
public class TripTypeFinalProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(TripTypeFinalProjectApplication.class, args);
    }
}
package com.kh.triptype.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * DB 기능 묶음
 * - app.db.enabled=true 일 때만 로딩
 * - prod(Render)에서는 false → DB 관련 빈 아예 생성 안 됨
 */
@Configuration
@ConditionalOnProperty(
    name = "app.db.enabled",
    havingValue = "true",
    matchIfMissing = true   // local 기본값 true
)
@ComponentScan(basePackages = {

    // 🔴 현재 DB 전제 패키지
    "com.kh.triptype.admin",
    "com.kh.triptype.statistics",
    "com.kh.triptype.pricing",
    "com.kh.triptype.flight",
    "com.kh.triptype.notice",

    // 🔵 지금은 비어있어도 "역할상 DB 도메인"
    "com.kh.triptype.member",
    "com.kh.triptype.mypage",
    "com.kh.triptype.survey",
    "com.kh.triptype.review"
})
public class DbFeatureConfig {
}

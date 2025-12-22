package com.kh.triptype;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 공통 엔트리포인트
 * - 기본 스캔은 "DB 비의존 기능"만 포함
 * - DB 기능은 DbFeatureConfig에서 조건부로 스캔
 */
@SpringBootApplication
public class TripTypeFinalProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(TripTypeFinalProjectApplication.class, args);
    }
}
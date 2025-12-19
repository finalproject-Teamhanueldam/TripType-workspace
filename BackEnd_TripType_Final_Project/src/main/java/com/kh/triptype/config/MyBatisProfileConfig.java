package com.kh.triptype.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * prod 환경에서는 DB / MyBatis를 사용하지 않기 위한 설정
 */
@Configuration
@Profile("!prod")
@MapperScan("com.kh.triptype")
public class MyBatisProfileConfig {
}

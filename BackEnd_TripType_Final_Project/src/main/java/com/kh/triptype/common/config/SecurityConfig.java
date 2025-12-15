package com.kh.triptype.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .formLogin(form -> form.disable())      // 기본 로그인 화면 비활성화
                .httpBasic(basic -> basic.disable())      // Basic Auth 비활성화
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/triptype/",
                                "/triptype/logo_image/**",   // 로고 이미지 허용
                                "/triptype/images/**",
                                "/triptype/css/**",
                                "/triptype/js/**",
                                "/**"
                        ).permitAll()
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}

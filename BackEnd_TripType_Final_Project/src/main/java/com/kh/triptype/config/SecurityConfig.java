package com.kh.triptype.config;

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
            .cors(cors -> {})                
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/", 
                    "/triptype/",
                    "/oauth2/**",                 // ⭐ 네이버 OAuth 진입
                    "/login/**",                  // ⭐ OAuth 콜백
                    "/triptype/login/**",         // ⭐ 로그인 성공 후
                    "/triptype/images/**",
                    "/triptype/css/**",
                    "/triptype/js/**"
                ).permitAll()
                .anyRequest().permitAll()
            )

            // ⭐ 네이버 OAuth 핵심
            .oauth2Login(oauth -> oauth
                .defaultSuccessUrl("/triptype/login/success", true)
            );

        return http.build();
    }
}

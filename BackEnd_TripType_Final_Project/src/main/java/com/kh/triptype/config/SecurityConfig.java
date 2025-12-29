package com.kh.triptype.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    	
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {}) // ⭐ 아래 Bean과 연결됨
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            .authorizeHttpRequests(auth -> auth
                // ✅ 회원가입 + 이메일 인증은 로그인 없이 허용
                .requestMatchers(
                    "/mail/auth/**",
                    "/member/join"
                ).permitAll()

                // 기존 허용 경로
                .requestMatchers(
                    "/",
                    "/triptype/",
                    "/triptype/oauth2/**",
                    "/triptype/login/**",
                    "/triptype/images/**",
                    "/triptype/css/**",
                    "/triptype/js/**"
                ).permitAll()

                .anyRequest().permitAll()
            )

            // 네이버 OAuth
            .oauth2Login(oauth -> oauth
                .defaultSuccessUrl("/triptype/login/success", true)
            );

        return http.build();
    }

    // ⭐⭐⭐ 이게 핵심 (없어서 CORS 터졌던 것)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 프론트 주소
        config.setAllowedOrigins(List.of("http://localhost:5173"));

        // 허용 메서드
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 모든 헤더 허용
        config.setAllowedHeaders(List.of("*"));

        // 쿠키/인증정보 허용
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

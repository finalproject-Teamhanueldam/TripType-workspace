package com.kh.triptype.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.kh.triptype.auth.jwt.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;


@Configuration
@RequiredArgsConstructor
public class SecurityConfig {


	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    	
        http 
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {}) // ⭐ 아래 Bean과 연결됨
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            // 인증 실패 시 OAuth redirect 금지 (마이페이지 관련 문제 때문에 추가)
            .exceptionHandling(e -> e
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write(
                        "{\"message\":\"UNAUTHORIZED\"}"
                    );
                })
            )
            

            // 세션: OAuth에서만 사용
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
            
            .authorizeHttpRequests(auth -> auth
            		
            	// ✅ 1️⃣ 소셜 연동 "시작" → 로그인 필수
            	.requestMatchers("/api/mypage/social/link/**").authenticated()	
                // ✅ 회원가입 + 이메일 인증은 로그인 없이 허용
                .requestMatchers(
                    "/",
                    "/triptype/",
                    "/mail/auth/**",
                    "/member/join",
                    "/auth/**",
                    
                    // ⭐⭐ 소셜 연동 시작 / 콜백 (핵심)
                    "/api/oauth/link/**",

                    // OAuth 기본 경로
                    "/triptype/login/**",
                    "/triptype/oauth2/**",

                    // 정적 리소스
                    "/triptype/images/**",
                    "/triptype/css/**",
                    "/triptype/js/**"                   
                ).permitAll()

                // ✅✅ [추가] 취향 설문 API는 로그인 필수
                .requestMatchers(
                    "/triptype/api/survey/**",
                    "/api/survey/**"
                ).authenticated()
                
                // JWT 보호 API
                .requestMatchers("/triptype/airline/review", "/airline/review").authenticated()
                .requestMatchers("/triptype/api/mypage/**", "/api/mypage/**").authenticated()
                .requestMatchers("/api/member/me", "/triptype/api/member/me").authenticated()
                
                // ✨ 첨부파일 다운로드는 로그인된 사용자만 (김동윤)
                .requestMatchers(
                    "/triptype/notice/download/**",
                    "/notice/download/**",
                    "/triptype/upload/notice/**",
                    "/upload/notice/**"
                ).authenticated()  // 인증 필요
                
                // 관리자 페이지 → ADMIN 권한 필요 (김동윤)
                .requestMatchers("/triptype/admin/**").hasRole("ADMIN")
                
                .requestMatchers("/triptype/airline/review").authenticated() 

                
                .anyRequest().permitAll()
            )
            
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
            

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

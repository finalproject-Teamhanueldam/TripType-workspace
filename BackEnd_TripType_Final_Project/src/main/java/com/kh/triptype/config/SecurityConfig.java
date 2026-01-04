package com.kh.triptype.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
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
            
            // 마이페이지 principal을 직접 꺼내서 오류나는 부분 수정
            .anonymous(anonymous -> anonymous.disable())

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
            

            // 세션 완전 비활성화
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    org.springframework.security.config.http.SessionCreationPolicy.STATELESS
                )
            )
            
            .authorizeHttpRequests(auth -> auth
                // ✅ 회원가입 + 이메일 인증은 로그인 없이 허용

                .requestMatchers(
                    "/mail/auth/**",
                    "/member/join",
                    "/auth/**"
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


                // JWT 보호 API
                .requestMatchers("/triptype/airline/review", "/airline/review").authenticated()
                .requestMatchers("/triptype/api/mypage/**", "/api/mypage/**").authenticated()

                
                // ✨ 첨부파일 다운로드는 로그인된 사용자만 (김동윤)
                .requestMatchers(
                    "/triptype/notice/download/**",
                    "/notice/download/**",
                    "/triptype/upload/notice/**",
                    "/upload/notice/**"
                ).authenticated()  // 인증 필요
                
                // 관리자 페이지 → ADMIN 권한 필요 (김동윤)
                // 수정 hasRole -> hasAuthority (JWT 있는 값 그대로 사용) (최경환)
                .requestMatchers("/triptype/admin/**").hasAuthority("ADMIN")
                
                .requestMatchers("/triptype/airline/review").authenticated() 

                
                .anyRequest().permitAll()
            )
            
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
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

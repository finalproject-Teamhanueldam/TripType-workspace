package com.kh.triptype.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.kh.triptype.auth.jwt.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;


@Configuration
@RequiredArgsConstructor
public class SecurityConfig {


	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	// 🔹 JwtProvider 주입 (필터에 넘기기 위함) (김동윤)
//    private final JwtProvider jwtProvider;
//
//    public SecurityConfig(JwtProvider jwtProvider) {
//        this.jwtProvider = jwtProvider;
//    }
	
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    	
        http 
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {}) // ⭐ 아래 Bean과 연결됨
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            // JWT 인증 필터 등록 (갬둉온)
            // UsernamePasswordAuthenticationFilter 전에 실행됨
//            .addFilterBefore(
//                new JwtAuthFilter(jwtProvider),
//                UsernamePasswordAuthenticationFilter.class
//            )
            
            .authorizeHttpRequests(auth -> auth

                // ✅ 회원가입 + 이메일 인증은 로그인 없이 허용
            	// 첨부파일 "/upload/**", "/triptype/upload/**", 추가 26.1.1
                .requestMatchers(
                	"/triptype/notice/download/**",
                	"/notice/download/**",
                	"/triptype/upload/notice/**",
                	"/upload/notice/**",
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

                .requestMatchers("/triptype/airline/review").authenticated() 
                
                .anyRequest().permitAll()
            )
            
            // ⭐⭐⭐ 여기 추가
            .addFilterBefore(
                jwtAuthenticationFilter,
                org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class
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

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
                    "/oauth2/**",
                    "/login/**",
                    "/images/**",
                    "/css/**",
                    "/js/**"
                ).permitAll()
                .anyRequest().permitAll()
            )

            // ✅ 네이버 OAuth 성공 시
            .oauth2Login(oauth -> oauth
                .defaultSuccessUrl("/login/success", true)
            );

        return http.build();
    }
}

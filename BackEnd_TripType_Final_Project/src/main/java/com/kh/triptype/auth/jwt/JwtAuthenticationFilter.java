package com.kh.triptype.auth.jwt;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.kh.triptype.auth.model.vo.AuthUser;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
    	System.out.println("🔥 JwtFilter HIT: " + request.getRequestURI());
        String authHeader = request.getHeader("Authorization");
        System.out.println("🔥 authHeader = " + authHeader);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);
            System.out.println("🔥 token valid = " + jwtProvider.validateToken(token));
            if (jwtProvider.validateToken(token)) {

                int memberNo = jwtProvider.getMemberNo(token);
                String role = jwtProvider.getRole(token);

                AuthUser authUser = new AuthUser(memberNo, role);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                authUser,
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + role))
                        );

                SecurityContextHolder.getContext()
                                     .setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}

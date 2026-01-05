//package com.kh.triptype.auth.jwt;
//
//import java.io.IOException;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import io.jsonwebtoken.Claims;
//import lombok.RequiredArgsConstructor;
//
//@RequiredArgsConstructor
//public class JwtAuthFilter extends OncePerRequestFilter {
//
//    // 🔹 기존 JwtProvider 그대로 사용
//	// 김동윤 수저엉
//    private final JwtProvider jwtProvider;
//
//    @Override
//    protected void doFilterInternal(
//            HttpServletRequest request,
//            HttpServletResponse response,
//            FilterChain filterChain
//    ) throws ServletException, IOException {
//
//        // 1️⃣ Authorization 헤더 확인
//        String authHeader = request.getHeader("Authorization");
//
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//
//            // 2️⃣ "Bearer " 이후 토큰만 추출
//            String token = authHeader.substring(7);
//
//            // 3️⃣ 토큰 유효성 검증
//            if (jwtProvider.validateToken(token)) {
//
//                // 4️⃣ Claims 추출
//                Claims claims = jwtProvider.getClaims(token);
//
//                Long memberNo = Long.valueOf(claims.getSubject());
//                String role = (String) claims.get("role");
//
//                // 5️⃣ 컨트롤러에서 쓰도록 request에 저장
//                request.setAttribute("memberNo", memberNo);
//                request.setAttribute("role", role);
//            }
//        }
//
//        // 6️⃣ 다음 필터로 넘김
//        filterChain.doFilter(request, response);
//    }
//}

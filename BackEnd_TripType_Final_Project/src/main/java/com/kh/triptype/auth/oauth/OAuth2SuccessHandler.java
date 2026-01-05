package com.kh.triptype.auth.oauth;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.kh.triptype.auth.jwt.JwtProvider;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication
    ) throws IOException {

        // ✅✅✅ link/login 모드 판별: request param(state) 금지, 세션 플래그만 사용
        HttpSession session = request.getSession(false);
        boolean isLinkMode = session != null && Boolean.TRUE.equals(session.getAttribute("OAUTH_LINK_MODE"));

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        Integer memberNo = oauth2User.getAttribute("memberNo");
        String role = oauth2User.getAttribute("memberRole");

        if (memberNo == null) {
            throw new RuntimeException("SOCIAL_LOGIN_MEMBER_NOT_FOUND");
        }

        // ✅ 연동 모드: JWT 발급 절대 금지 + 세션 값 정리
        if (isLinkMode) {
            session.removeAttribute("OAUTH_LINK_MODE");
            session.removeAttribute("OAUTH_LINK_MEMBER_NO");
            session.removeAttribute("OAUTH_LINK_PROVIDER");

            response.sendRedirect(frontendUrl + "/mypage?linked=true");
            return;
        }

        // ✅ 로그인 모드에서만 JWT 발급
        String token = jwtProvider.createToken(memberNo, role);

        response.sendRedirect(
            frontendUrl + "/oauth/success?token=" + token
        );
    }
}

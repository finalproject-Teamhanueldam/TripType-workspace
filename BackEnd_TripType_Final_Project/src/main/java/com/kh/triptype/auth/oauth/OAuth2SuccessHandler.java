package com.kh.triptype.auth.oauth;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.kh.triptype.auth.jwt.JwtProvider;
import com.kh.triptype.member.dao.MemberDao;
import com.kh.triptype.member.model.vo.Member;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;
    private final MemberDao memberDao;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication
    ) throws IOException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        Integer memberNo = oauth2User.getAttribute("memberNo");
        String role = oauth2User.getAttribute("memberRole");

        if (memberNo == null) {
            throw new RuntimeException("SOCIAL_LOGIN_MEMBER_NOT_FOUND");
        }

        String token = jwtProvider.createToken(memberNo, role);

        response.sendRedirect(
            frontendUrl + "/oauth/success?token=" + token
        );
    }
}


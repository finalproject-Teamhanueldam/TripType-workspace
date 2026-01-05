package com.kh.triptype.mypage.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.auth.model.vo.AuthUser;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MySocialController {

    @GetMapping("/social/link/kakao")
    public ResponseEntity<Map<String, String>> linkKakao(Authentication authentication) {

        // ✅ 여기서 authentication null이면 "진짜로 로그인 안된 상태"
        AuthUser authUser = (AuthUser) authentication.getPrincipal();

        String redirectUri = URLEncoder.encode(
            "http://localhost:8001/triptype/api/oauth/link/kakao",
            StandardCharsets.UTF_8
        );

        String url =
            "https://kauth.kakao.com/oauth/authorize"
            + "?client_id=4e8b1655dce3056f1c21154cff006529"
            + "&redirect_uri=" + redirectUri
            + "&response_type=code"
            + "&scope=account_email,profile_nickname"
            + "&state=" + authUser.getMemberNo(); // ✅ memberNo 전달

        return ResponseEntity.ok(Map.of("url", url));
    }
}

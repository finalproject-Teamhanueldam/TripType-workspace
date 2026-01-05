package com.kh.triptype.member.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.auth.jwt.JwtProvider;
import com.kh.triptype.member.model.dto.MemberMeResponse;
import com.kh.triptype.member.service.MemberService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MemberMeController {

    private final MemberService memberService;
    private final JwtProvider jwtProvider;

    @GetMapping("/api/member/me")
    public MemberMeResponse me(HttpServletRequest request) {

        // Authorization: Bearer xxx
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("NO_AUTH_HEADER");
        }

        String token = authHeader.substring(7);
        int memberNo = jwtProvider.getMemberNo(token);

        return memberService.findMe(memberNo);
    }
}

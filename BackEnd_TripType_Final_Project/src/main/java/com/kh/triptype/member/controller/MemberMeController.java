package com.kh.triptype.member.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.auth.model.vo.AuthUser;
import com.kh.triptype.member.model.dto.MemberMeResponse;
import com.kh.triptype.member.service.MemberService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MemberMeController {

    private final MemberService memberService;

    @GetMapping("/api/member/me")
    public MemberMeResponse me(Authentication authentication) {

        if (authentication == null || !(authentication.getPrincipal() instanceof AuthUser)) {
            throw new RuntimeException("UNAUTHORIZED");
        }

        AuthUser authUser = (AuthUser) authentication.getPrincipal();

        int memberNo = authUser.getMemberNo();

        return memberService.findMe(memberNo);
    }
}

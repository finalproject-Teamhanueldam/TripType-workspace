package com.kh.triptype.auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.auth.jwt.JwtProvider;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class JwtTestController {

    private final JwtProvider jwtProvider;

    @GetMapping("/auth/jwt-test")
    public String test() {
        return jwtProvider.createToken(1, "USER");
    }
}

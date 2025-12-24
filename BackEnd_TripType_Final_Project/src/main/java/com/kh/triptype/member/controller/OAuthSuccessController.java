package com.kh.triptype.member.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/login")
public class OAuthSuccessController {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @GetMapping("/success")
    public void loginSuccess(HttpServletResponse response) throws IOException {
        response.sendRedirect(frontendUrl);
    }
}

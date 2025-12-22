package com.kh.triptype.member.controller;

import java.io.IOException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/login")
public class OAuthSuccessController {

    @GetMapping("/success")
    public void loginSuccess(HttpServletResponse response) throws IOException {
        response.sendRedirect("https://trip-type-workspace.vercel.app/");
    }
}
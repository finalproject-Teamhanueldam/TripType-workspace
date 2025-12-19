package com.kh.triptype.member.controller;

import java.io.IOException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/triptype/login")
public class OAuthSuccessController {

    @GetMapping("/success")
    public void success(HttpServletResponse response) throws IOException {
        response.sendRedirect("http://localhost:5173/member?tab=login&oauth=success");
    }
}
package com.kh.triptype.mypage.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.mypage.model.dto.MyProfileRes;
import com.kh.triptype.mypage.service.MyPageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage")
public class MyPageController {

    private final MyPageService myPageService;

    @GetMapping("/profile")
    public ResponseEntity<MyProfileRes> getMyProfile(
            @RequestParam("memberNo") int memberNo
    ) {
        MyProfileRes profile = myPageService.getMyProfile(memberNo);
        return ResponseEntity.ok(profile);
    }
}

package com.kh.triptype.mypage.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.auth.model.vo.AuthUser;
import com.kh.triptype.mypage.model.dto.MyPasswordChangeReq;
import com.kh.triptype.mypage.model.dto.MyProfileRes;
import com.kh.triptype.mypage.model.dto.MyProfileUpdateReq;
import com.kh.triptype.mypage.model.dto.SearchHistoryDto;
import com.kh.triptype.mypage.service.MyPageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService myPageService;

    @GetMapping("/profile")
    public ResponseEntity<MyProfileRes> getMyProfile(Authentication authentication) {

        if (!(authentication instanceof UsernamePasswordAuthenticationToken)) {
            return ResponseEntity.status(401).build();
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof AuthUser authUser)) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(
            myPageService.getMyProfile(authUser.getMemberNo())
        );
    }

    @PutMapping("/profile")
    public ResponseEntity<Void> updateMyProfile(
            Authentication authentication,
            @RequestBody MyProfileUpdateReq req
    ) {
        AuthUser authUser = (AuthUser) authentication.getPrincipal();

        myPageService.updateMyProfile(
                authUser.getMemberNo(),
                req
        );
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
            Authentication authentication,
            @RequestBody MyPasswordChangeReq req
    ) {
        AuthUser authUser = (AuthUser) authentication.getPrincipal();
        myPageService.changePassword(authUser.getMemberNo(), req);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/withdraw")
    public ResponseEntity<Void> withdraw(
            Authentication authentication,
            @RequestBody Map<String, String> body
    ) {
        AuthUser authUser = (AuthUser) authentication.getPrincipal();
        String password = body.get("password");

        myPageService.withdraw(authUser.getMemberNo(), password);
        return ResponseEntity.ok().build();
    }
    
    
    @GetMapping("/searchHistory")
    public ResponseEntity<List<SearchHistoryDto>> fetchSearchHistory(
            Authentication authentication
    ) {
        AuthUser authUser = (AuthUser) authentication.getPrincipal();
        
        List<SearchHistoryDto> list =
            myPageService.fetchSearchHistory((int)authUser.getMemberNo());
       
        System.out.println(list);
        return ResponseEntity.ok(list);
    }
}

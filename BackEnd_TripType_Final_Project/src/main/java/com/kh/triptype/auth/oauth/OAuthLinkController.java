package com.kh.triptype.auth.oauth;

import java.io.IOException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.kh.triptype.mypage.service.MySocialService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/oauth/link")
@RequiredArgsConstructor
public class OAuthLinkController {

    private final MySocialService mySocialService;

    @GetMapping("/kakao")
    public void kakaoLink(
        @RequestParam String code,
        @RequestParam String state,
        HttpServletResponse response
    ) throws IOException {

        int memberNo = Integer.parseInt(state);

        try {
            mySocialService.completeLink(memberNo, "KAKAO", code);
            response.sendRedirect(
                "http://localhost:5173/mypage?link=kakao-success"
            );

        } catch (ResponseStatusException e) {

            if ("ALREADY_LINKED_TO_OTHER_MEMBER".equals(e.getReason())) {
                response.sendRedirect(
                    "http://localhost:5173/mypage?link=kakao-already-linked"
                );
                return;
            }

            response.sendRedirect(
                "http://localhost:5173/mypage?link=fail"
            );
        }
    }
}

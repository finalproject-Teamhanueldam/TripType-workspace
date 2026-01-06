package com.kh.triptype.mypage.controller;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.kh.triptype.auth.model.vo.AuthUser;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MySocialController {
	
    @Value("${app.backend.url}")
    private String backendUrl; // http://192.168.150.180:8001/triptype
    
    @GetMapping("/social/link/kakao")
    public ResponseEntity<Map<String, String>> linkKakao(
    		
        Authentication authentication,
        HttpSession session
        
    ) {
        AuthUser authUser = (AuthUser) authentication.getPrincipal();
        session.setAttribute("OAUTH_LINK_MODE", true);
        session.setAttribute("OAUTH_LINK_MEMBER_NO", authUser.getMemberNo());
        return ResponseEntity.ok(
            Map.of(
                "url", backendUrl + "/oauth2/authorization/kakao"
            )
        );
    }
}
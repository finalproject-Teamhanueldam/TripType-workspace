package com.kh.triptype.mail.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.mail.service.EmailAuthService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/mail/auth")
public class EmailAuthController {
	
    @Autowired
    private EmailAuthService emailAuthService;

    /**
     * 인증번호 발송
     * POST /mail/auth/send
     */
    @PostMapping("/send")
    public ResponseEntity<Void> sendAuthMail(@RequestParam String email) {
        emailAuthService.sendAuthMail(email);
        return ResponseEntity.ok().build();
    }

    /**
     * 인증번호 검증 ⭐ 이게 핵심
     * POST /mail/auth/verify
     */
    @PostMapping("/verify")
    public ResponseEntity<Void> verifyAuthCode(
    		@RequestBody Map<String, String> req
    ) {

    	String email = req.get("email");
        String code = req.get("authCode");
    	
        if (email == null || code == null || code.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        boolean isValid = emailAuthService.verifyAuthCode(email, code);

        if (!isValid) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok().build();
    }
}

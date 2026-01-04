package com.kh.triptype.common.exception;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.kh.triptype.auth.exception.LoginFailException;
import com.kh.triptype.auth.model.dto.LoginFailResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(LoginFailException.class)
    public ResponseEntity<LoginFailResponse> handleLoginFail(LoginFailException e) {

        LoginFailResponse response = new LoginFailResponse(
                e.getMessage(),
                e.getLoginFailCount(),
                e.isLocked(),
                e.isWithdrawn()
        );

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }
    
    // 관리자 계정은 비활성화할 수 없습니다 보내기 위해서 만든 클래스
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalState(IllegalStateException e) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
    }
}

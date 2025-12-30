package com.kh.triptype.common.exception;

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
                e.isLocked()
        );

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }
}

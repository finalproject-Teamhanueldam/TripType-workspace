package com.kh.triptype.auth.exception;

import lombok.Getter;

@Getter
public class LoginFailException extends RuntimeException {
	
	private static final long serialVersionUID = 1L;

    private final int loginFailCount;
    private final boolean locked;

    public LoginFailException(String message, int loginFailCount, boolean locked) {
        super(message);
        this.loginFailCount = loginFailCount;
        this.locked = locked;
    }
}

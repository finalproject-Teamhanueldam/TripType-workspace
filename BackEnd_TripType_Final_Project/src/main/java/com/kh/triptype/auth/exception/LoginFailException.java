package com.kh.triptype.auth.exception;

import lombok.Getter;

@Getter
public class LoginFailException extends RuntimeException {
	
	private static final long serialVersionUID = 1L;

    private final int loginFailCount;
    private final boolean locked;
    private final boolean withdrawn;

    public LoginFailException(String message, int loginFailCount,
    						  boolean locked, boolean withdrawn) {
        super(message);
        this.loginFailCount = loginFailCount;
        this.locked = locked;
        this.withdrawn = withdrawn;
    }
}

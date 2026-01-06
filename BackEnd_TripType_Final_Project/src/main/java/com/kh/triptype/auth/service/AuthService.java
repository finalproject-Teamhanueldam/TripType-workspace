package com.kh.triptype.auth.service;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.kh.triptype.auth.exception.LoginFailException;
import com.kh.triptype.auth.jwt.JwtProvider;
import com.kh.triptype.auth.model.dto.LoginRequest;
import com.kh.triptype.auth.model.dto.LoginResponse;
import com.kh.triptype.member.dao.MemberDao;
import com.kh.triptype.member.model.vo.Member;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberDao memberDao;
    private final JwtProvider jwtProvider;
    private final BCryptPasswordEncoder passwordEncoder;
    private static final long INACTIVITY_HOURS = 12; // 발표용
    
// GlobalExceptionHandler + LoginFailResponse
//    switch (data?.message) {
//	    case "WITHDRAWN_ACCOUNT":
//	      message = "탈퇴 처리된 계정입니다.";
//	      break;
//	    case "LOCKED_ACCOUNT":
//	      message = "계정이 잠겨 로그인할 수 없습니다.";
//	      break;
//	    case "INVALID_CREDENTIALS":
//	      message = "이메일 또는 비밀번호가 올바르지 않습니다.";
//	      break;
//	  }
    
    public LoginResponse login(LoginRequest req) {

        // 1️ 회원 조회
        Member member = memberDao.findByMemberId(req.getMemberId());

        if (member == null) {
            throw new LoginFailException(
                "INVALID_CREDENTIALS",
                0,
                false,
                false
            );
        }
        
        // 2️ 자체 탈퇴 계정 (withdrawn_at 기준)
        if (member.getMemberWithdrawnAt() != null) {
            throw new LoginFailException(
                "WITHDRAWN_ACCOUNT",
                0,
                false,
                true
            );
        }

        // 3️⃣ 관리자 비활성 계정
        if ("N".equals(member.getMemberIsActive())) {
            throw new LoginFailException(
                "INACTIVE_ACCOUNT",
                0,
                false,
                false
            );
        }

        // 3️ 장기 미접속(12시간) 체크
        if (member.getMemberLastLoginAt() != null) {

            LocalDateTime lastLogin = member.getMemberLastLoginAt();
            LocalDateTime now = LocalDateTime.now();

            long hours = Duration.between(lastLogin, now).toHours();

            if (hours >= INACTIVITY_HOURS) {
                memberDao.lockMember(member.getMemberNo());

                throw new LoginFailException(
                    "LOCKED_ACCOUNT_INACTIVE",
                    member.getMemberLoginFailCount(),
                    true,
                    false
                );
            }
        }
        
        // 4 계정 잠김 체크
        if ("Y".equals(member.getMemberIsLocked())) {
            throw new LoginFailException(
                "LOCKED_ACCOUNT",
                member.getMemberLoginFailCount(),
                true,
                false
            );
        }

        // 5️ 비밀번호 검증
        if (!passwordEncoder.matches(
                req.getMemberPassword(),
                member.getMemberPassword())) {

            memberDao.increaseLoginFailCount(member.getMemberNo());
            int failCount = member.getMemberLoginFailCount() + 1;

            if (failCount >= 5) {
                memberDao.lockMember(member.getMemberNo());

                throw new LoginFailException(
                    "LOCKED_ACCOUNT",
                    failCount,
                    true,
                    false
                );
            }

            throw new LoginFailException(
                "INVALID_CREDENTIALS",
                failCount,
                false,
                false
            );
        }

        // 6 로그인 성공 처리
        memberDao.resetLoginFailCount(member.getMemberNo());
        memberDao.updateLastLogin(member.getMemberNo());

        // 7 JWT 발급
        String token = jwtProvider.createToken(
                member.getMemberNo(),
                member.getMemberRole()
        );

        return new LoginResponse(
                token,
                member.getMemberName(),
                member.getMemberRole()
        );
    }
}

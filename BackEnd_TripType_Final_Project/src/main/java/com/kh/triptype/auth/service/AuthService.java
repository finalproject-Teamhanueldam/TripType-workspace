package com.kh.triptype.auth.service;

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

    public LoginResponse login(LoginRequest req) {

        // 1️ 회원 조회
        Member member = memberDao.findByMemberId(req.getMemberId());

        if (member == null) {
            throw new LoginFailException(
                "존재하지 않는 회원입니다.",
                0,
                false
            );
        }

        // 2️ 계정 잠김 체크
        if ("Y".equals(member.getMemberIsLocked())) {
            throw new LoginFailException(
                "계정이 잠겨 있습니다.",
                member.getMemberLoginFailCount(),
                true
            );
        }

        // 3️ 비밀번호 검증
        if (!passwordEncoder.matches(
                req.getMemberPassword(),
                member.getMemberPassword())) {

            memberDao.increaseLoginFailCount(member.getMemberNo());

            int failCount = member.getMemberLoginFailCount() + 1;
            
            if (failCount >= 5) {
                memberDao.lockMember(member.getMemberNo()); // MEMBER_IS_LOCKED = 'Y'
                throw new LoginFailException(
                    "로그인 실패 횟수 초과로 계정이 잠겼습니다.",
                    failCount,
                    true
                );
            }
            
            throw new LoginFailException(
                "비밀번호가 일치하지 않습니다.",
                failCount,
                false
            );
        }

        // 4️ 로그인 성공 처리
        memberDao.resetLoginFailCount(member.getMemberNo());
        memberDao.updateLastLogin(member.getMemberNo());

        // 5️ JWT 발급
        String token = jwtProvider.createToken(
                (long) member.getMemberNo(),
                member.getMemberRole()
        );

        return new LoginResponse(
                token,
                member.getMemberName(),
                member.getMemberRole()
        );
    }
}

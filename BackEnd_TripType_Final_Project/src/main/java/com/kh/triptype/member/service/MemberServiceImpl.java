package com.kh.triptype.member.service;

import java.sql.Date;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.triptype.member.dao.MemberDao;
import com.kh.triptype.member.model.dto.MemberJoinRequestDto;
import com.kh.triptype.member.model.vo.Member;

@Service
public class MemberServiceImpl implements MemberService {

    @Autowired
    private MemberDao memberDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final int AUTH_EXPIRE_MINUTES = 5;

    @Override
    @Transactional
    public void join(MemberJoinRequestDto req) {

        // 1️⃣ 이메일 중복 검사
        int count = memberDao.countByMemberId(req.getMemberId());
        if (count > 0) {
            throw new IllegalStateException("이미 사용 중인 이메일입니다.");
        }

        // 2️⃣ 이메일 인증번호 검증
        boolean authValid = memberDao.isValidAuthCode(
                req.getMemberId(),
                req.getAuthCode(),
                AUTH_EXPIRE_MINUTES
        );

        if (!authValid) {
            throw new IllegalArgumentException("인증번호가 올바르지 않거나 만료되었습니다.");
        }

        // 3️⃣ Member VO 생성
        Member member = new Member();
        member.setMemberId(req.getMemberId());
        member.setMemberPassword(passwordEncoder.encode(req.getMemberPassword()));
        member.setMemberName(req.getMemberName());
        member.setMemberGender(req.getMemberGender());
        member.setMemberPhone(req.getMemberPhone());

        LocalDate birth = LocalDate.parse(req.getMemberBirthDate());
        member.setMemberBirthDate(Date.valueOf(birth));

        // 4️⃣ insert
        int result = memberDao.insertMember(member);
        if (result != 1) {
            throw new RuntimeException("회원가입 처리 중 오류가 발생했습니다.");
        }

        // 5️⃣ 인증 정보 삭제 (선택이지만 권장)
        memberDao.deleteAuth(req.getMemberId());
    }
}

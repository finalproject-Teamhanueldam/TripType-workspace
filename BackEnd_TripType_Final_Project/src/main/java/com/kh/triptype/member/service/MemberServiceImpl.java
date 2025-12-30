package com.kh.triptype.member.service;

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

    @Override
    @Transactional
    public void join(MemberJoinRequestDto req) {

        // 1️ 이메일 중복 검사
        int count = memberDao.countByMemberId(req.getMemberId());
        if (count > 0) {
            throw new IllegalStateException("이미 사용 중인 이메일입니다.");
        }


        // 2 Member VO 생성
        Member member = new Member();
        member.setMemberId(req.getMemberId());
        member.setMemberPassword(passwordEncoder.encode(req.getMemberPassword()));
        member.setMemberName(req.getMemberName());
        member.setMemberGender(req.getMemberGender());
        member.setMemberPhone(req.getMemberPhone());
        member.setMemberBirthDate(req.getMemberBirthDate());

        // 3 insert
        int result = memberDao.insertMember(member);
        if (result != 1) {
            throw new RuntimeException("회원가입 처리 중 오류가 발생했습니다.");
        }

        // 4 인증 정보 삭제 (선택이지만 권장)
        memberDao.deleteAuth(req.getMemberId());
    }
}

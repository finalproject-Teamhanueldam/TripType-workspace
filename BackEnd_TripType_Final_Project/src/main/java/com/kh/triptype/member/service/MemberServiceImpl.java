package com.kh.triptype.member.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.triptype.member.dao.MemberDao;
import com.kh.triptype.member.model.dto.MemberJoinRequestDto;
import com.kh.triptype.member.model.dto.MemberUnlockRequest;
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
    
    @Override
    @Transactional
    public void resetPassword(
            String memberName,
            String memberId,
            String newPassword
    ) {
        // 1️ 이름 + 이메일 존재 확인
    	int count = memberDao.countByNameAndMemberId(memberName, memberId);

        if (count == 0) {
            throw new IllegalArgumentException("이름 또는 이메일이 일치하지 않습니다.");
        }

        // 2️ 이메일 인증 완료 여부 확인
        int verified = memberDao.countVerifiedAuth(memberId);
        if (verified == 0) {
            throw new IllegalStateException("이메일 인증을 완료해주세요.");
        }

        // 3️ 비밀번호 암호화
        String encodedPw = passwordEncoder.encode(newPassword);

        // 4️ 비밀번호 업데이트
        int result = memberDao.updatePasswordByMemberId(memberId, encodedPw);
        if (result != 1) {
            throw new RuntimeException("비밀번호 재설정에 실패했습니다.");
        }

        // 5️ 인증 정보 삭제 (선택이지만 강력 추천)
        memberDao.deleteAuth(memberId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<String> findMemberIds(String memberName, String memberBirthDate) {

        List<String> ids =
            memberDao.findIdsByNameAndBirth(memberName, memberBirthDate);

        if (ids.isEmpty()) {
            throw new IllegalArgumentException("일치하는 회원 정보가 없습니다.");
        }

        return ids.stream()
                .map(this::maskEmail)
                .toList();
    }

    /**
     * 이메일 마스킹
     * 예) triptype123@naver.com → tr***@naver.com
     */
    private String maskEmail(String email) {
        String[] parts = email.split("@");
        String id = parts[0];
        String domain = parts[1];

        return id.substring(0, 3)
             + "*".repeat(id.length() - 3)
             + "@"
             + domain;
    }
    
    @Override
    @Transactional
    public void unlockMember(MemberUnlockRequest req) {

        // 1️ 이름 + 이메일 존재 확인
        int count = memberDao.countByNameAndMemberId(
            req.getMemberName(),
            req.getMemberId()
        );

        if (count == 0) {
            throw new IllegalArgumentException("이름 또는 이메일이 일치하지 않습니다.");
        }

        // 2️ 이메일 인증 여부 확인
        int verified = memberDao.countVerifiedAuth(req.getMemberId());
        if (verified == 0) {
            throw new IllegalStateException("이메일 인증을 완료해주세요.");
        }

        // 3️ 비밀번호 변경
        String encodedPw = passwordEncoder.encode(req.getNewPassword());
        int pwResult = memberDao.updatePasswordByMemberId(
            req.getMemberId(),
            encodedPw
        );

        if (pwResult != 1) {
            throw new RuntimeException("비밀번호 변경에 실패했습니다.");
        }

        // 4️ 회원 번호 조회
        Member member = memberDao.findByMemberId(req.getMemberId());
        if (member == null) {
            throw new IllegalStateException("회원 정보를 찾을 수 없습니다.");
        }
        
        // 이미 정상 계정인데 unlock API를 호출한 경우 비밀번호만 바꿔버리는 사고 방지
        if (!"Y".equals(member.getMemberIsLocked())) {
            throw new IllegalStateException("잠긴 계정이 아닙니다.");
        }
        
        int memberNo = member.getMemberNo();

        // 5️ 잠금 해제
        memberDao.unlockMember(memberNo);

        // 6️ 로그인 실패 횟수 초기화
        memberDao.resetLoginFailCount(memberNo);

        // 7️ 인증 정보 삭제
        memberDao.deleteAuth(req.getMemberId());
    }
}
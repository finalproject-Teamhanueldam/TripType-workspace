package com.kh.triptype.member.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.triptype.member.dao.MemberDao;
import com.kh.triptype.member.model.dto.MemberJoinRequestDto;
import com.kh.triptype.member.model.dto.MemberMeResponse;
import com.kh.triptype.member.model.dto.MemberUnlockRequest;
import com.kh.triptype.member.model.vo.Member;

// ✅ [추가] 기존 설문 저장 로직 재사용
import com.kh.triptype.survey.model.dto.SurveySaveRequestDto;
import com.kh.triptype.survey.service.SurveyService;

@Service
public class MemberServiceImpl implements MemberService {

    @Autowired
    private MemberDao memberDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ [추가] 설문 서비스 주입 (새 메소드 만들지 않고 기존 saveOrUpdateSurvey 재사용)
    @Autowired
    private SurveyService surveyService;

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

        // ✅ [핵심] insert 후 memberNo 확보 (MyBatis selectKey로 memberNo가 member에 세팅되어 있어야 함)
	    // insert 후 memberNo 확보
        int memberNo = member.getMemberNo();
        if (memberNo <= 0) {
            throw new RuntimeException("회원가입 처리 중 오류가 발생했습니다. (memberNo 생성 실패)");
        }

        // 설문 저장
        if (req.getSurvey() != null) {
            SurveySaveRequestDto surveyDto = new SurveySaveRequestDto();
            surveyDto.setTypeCode(req.getSurvey().getTypeCode());
            surveyDto.setRelaxScore(req.getSurvey().getRelaxScore());
            surveyDto.setCityScore(req.getSurvey().getCityScore());
            surveyDto.setNatureScore(req.getSurvey().getNatureScore());
            surveyDto.setActivityScore(req.getSurvey().getActivityScore());

            surveyService.saveOrUpdateSurvey((long) memberNo, surveyDto);
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
        // 0️ 회원 조회
        Member member = memberDao.findByMemberId(memberId);
        if (member == null) {
            throw new IllegalArgumentException("INVALID_ACCOUNT");
        }

        // 1️ 탈퇴 계정 차단
        if ("N".equals(member.getMemberIsActive())) {
            throw new IllegalStateException("WITHDRAWN_ACCOUNT");
        }

        // 2️ 이름 검증
        if (!member.getMemberName().equals(memberName)) {
            throw new IllegalArgumentException("INVALID_ACCOUNT");
        }

        // 추가 (소셜회원이 일반회원으로 전환 후 필수 정보 누락일 경우)
        if (member.getMemberBirthDate() == null ||
            member.getMemberGender() == null) {
            throw new IllegalStateException("NEED_PROFILE_INFO");
        }
        
        // 3️ 이메일 인증 완료 여부
        int verified = memberDao.countVerifiedAuth(memberId);
        if (verified == 0) {
            throw new IllegalStateException("EMAIL_NOT_VERIFIED");
        }

        // 4️ 비밀번호 변경
        String encodedPw = passwordEncoder.encode(newPassword);
        int result = memberDao.updatePasswordByMemberId(memberId, encodedPw);

        if (result != 1) {
            throw new RuntimeException("PASSWORD_RESET_FAILED");
        }

        // 5️ 인증 정보 삭제
        memberDao.deleteAuth(memberId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> findMemberIds(String memberName, String memberBirthDate) {

        List<Member> members =
            memberDao.findMembersByNameAndBirth(memberName, memberBirthDate);

        if (members.isEmpty()) {
            throw new IllegalArgumentException("NOT_FOUND");
        }

        // 🔥 핵심: 필수 정보 누락 차단
        for (Member member : members) {
            if (member.getMemberBirthDate() == null ||
                member.getMemberGender() == null) {
                throw new IllegalStateException("NEED_PROFILE_INFO");
            }
        }

        return members.stream()
                .map(Member::getMemberId)
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

        // 0️ 회원 조회
        Member member = memberDao.findByMemberId(req.getMemberId());
        if (member == null) {
            throw new IllegalArgumentException("INVALID_ACCOUNT");
        }

        // 1️ 탈퇴 계정 차단
        if ("N".equals(member.getMemberIsActive())) {
            throw new IllegalStateException("WITHDRAWN_ACCOUNT");
        }

        // 2️ 잠긴 계정인지 확인
        if (!"Y".equals(member.getMemberIsLocked())) {
            throw new IllegalStateException("NOT_LOCKED_ACCOUNT");
        }

        // 3️ 이름 + 이메일 검증
        if (!member.getMemberName().equals(req.getMemberName())) {
            throw new IllegalArgumentException("INVALID_ACCOUNT");
        }

        // 4️ 이메일 인증 여부 확인
        int verified = memberDao.countVerifiedAuth(req.getMemberId());
        if (verified == 0) {
            throw new IllegalStateException("EMAIL_NOT_VERIFIED");
        }

        // 5️ 비밀번호 변경
        String encodedPw = passwordEncoder.encode(req.getNewPassword());
        memberDao.updatePasswordByMemberId(req.getMemberId(), encodedPw);

        // 6️ 잠금 해제
        memberDao.unlockMember(member.getMemberNo());
        // 7 장기 미접속 기준 초기화 (핵심)
        memberDao.updateLastLogin(member.getMemberNo());

        // 8 로그인 실패 횟수 초기화
        memberDao.resetLoginFailCount(member.getMemberNo());

        // 8️ 인증 정보 삭제
        memberDao.deleteAuth(req.getMemberId());
    }
 
    @Transactional(readOnly = true)
    @Override
    public MemberMeResponse findMe(int memberNo) {
        Member member = memberDao.findByMemberNo(memberNo);

        if (member == null) {
            throw new IllegalStateException("MEMBER_NOT_FOUND");
        }
        
        return new MemberMeResponse(
            member.getMemberNo(),
            member.getMemberId(),
            member.getMemberName(),
            member.getMemberRole()
        );
    }
}


package com.kh.triptype.member.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.kh.triptype.member.model.vo.Member;

@Repository
public class MemberDao {

    private static final String NAMESPACE = "memberMapper.";

    @Autowired
    private SqlSession sqlSession;

    // 이메일 중복 검사
    public int countByMemberId(String memberId) {
        return sqlSession.selectOne(
            NAMESPACE + "countByMemberId",
            memberId
        );
    }

    // 회원 insert
    public int insertMember(Member member) {
        return sqlSession.insert(
            NAMESPACE + "insertMember",
            member
        );
    }

    // 인증 정보 삭제
    public int deleteAuth(String memberId) {
        return sqlSession.delete(
            NAMESPACE + "deleteAuth",
            memberId
        );
    }
    
    // 이메일 인증 완료 여부 확인
    public int countVerifiedAuth(String memberId) {
        return sqlSession.selectOne(
            NAMESPACE + "countVerifiedAuth",
            Map.of("authEmail", memberId)
        );
    }
    
    // 로그인용 회원 조회
    public Member findByMemberId(String memberId) {
        return sqlSession.selectOne(
            NAMESPACE + "findByMemberId",
            memberId
        );
    }

    // 로그인 실패 횟수 증가
    public int increaseLoginFailCount(int memberNo) {
        return sqlSession.update(
            NAMESPACE + "increaseLoginFailCount",
            memberNo
        );
    }

    // 로그인 실패 횟수 초기화
    public int resetLoginFailCount(int memberNo) {
        return sqlSession.update(
            NAMESPACE + "resetLoginFailCount",
            memberNo
        );
    }
    
    public Member findByMemberNo(int memberNo) {
        return sqlSession.selectOne(
            NAMESPACE + "findByMemberNo",
            memberNo
        );
    }

    // 마지막 로그인 시간 갱신
    public int updateLastLogin(int memberNo) {
        return sqlSession.update(
            NAMESPACE + "updateLastLogin",
            memberNo
        );
    }
    
    // 비밀번호 찾기에서 비밀번호 재설정
    public int updatePasswordByMemberId(String memberId, String encodedPw) {
        return sqlSession.update(
            NAMESPACE + "updatePasswordByMemberId",
            Map.of(
                "memberId", memberId,
                "memberPassword", encodedPw
            )
        );
    }
    
    // 이름 + 이메일(아이디) 존재 여부 확인
    public int countByNameAndMemberId(String memberName, String memberId) {
        return sqlSession.selectOne(
            NAMESPACE + "countByNameAndMemberId",
            Map.of(
                "memberName", memberName,
                "memberId", memberId
            )
        );
    }
    
    // 이름 + 생년월일로 아이디 찾기
    public List<String> findIdsByNameAndBirth(
            String memberName,
            String memberBirthDate
    ) {
        return sqlSession.selectList(
            "memberMapper.findIdsByNameAndBirth",
            Map.of(
                "memberName", memberName,
                "memberBirthDate", memberBirthDate
            )
        );
    }
    
    // 계정 잠금 처리
    public int lockMember(int memberNo) {
        return sqlSession.update(
            NAMESPACE + "lockMember",
            memberNo
        );
    }
    
    // 계정 잠금 해제
    public int unlockMember(int memberNo) {
        return sqlSession.update(
            NAMESPACE + "unlockMember",
            memberNo
        );
    }
    
    // 소셜 회원가입
    public int insertSocialMember(Member member) {
        return sqlSession.insert(
            NAMESPACE + "insertSocialMember",
            member
        );
    }
}

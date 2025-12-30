package com.kh.triptype.member.dao;

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

    // 1️ 이메일 중복 검사
    public int countByMemberId(String memberId) {
        return sqlSession.selectOne(
            NAMESPACE + "countByMemberId",
            memberId
        );
    }

    // 2 회원 insert
    public int insertMember(Member member) {
        return sqlSession.insert(
            NAMESPACE + "insertMember",
            member
        );
    }

    // 3 인증 정보 삭제
    public int deleteAuth(String memberId) {
        return sqlSession.delete(
            NAMESPACE + "deleteAuth",
            memberId
        );
    }
    
    // 4 이메일 인증 완료 여부 확인
    public int countVerifiedAuth(String memberId) {
        return sqlSession.selectOne(
            NAMESPACE + "countVerifiedAuth",
            Map.of("authEmail", memberId)
        );
    }
}

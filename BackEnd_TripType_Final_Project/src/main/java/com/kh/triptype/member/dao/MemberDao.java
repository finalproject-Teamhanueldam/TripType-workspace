package com.kh.triptype.member.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.kh.triptype.member.model.dto.AuthParam;
import com.kh.triptype.member.model.vo.Member;

@Repository
public class MemberDao {

    private static final String NAMESPACE = "memberMapper.";

    @Autowired
    private SqlSession sqlSession;

    // 1️⃣ 이메일 중복 검사
    public int countByMemberId(String memberId) {
        return sqlSession.selectOne(
            NAMESPACE + "countByMemberId",
            memberId
        );
    }

    // 2️⃣ 이메일 인증번호 유효성 검사
    public boolean isValidAuthCode(String memberId, String authCode, int expireMinutes) {
        AuthParam param = new AuthParam(memberId, authCode, expireMinutes);
        Integer count = sqlSession.selectOne(
            NAMESPACE + "isValidAuthCode",
            param
        );
        return count != null && count > 0;
    }

    // 3️⃣ 회원 insert
    public int insertMember(Member member) {
        return sqlSession.insert(
            NAMESPACE + "insertMember",
            member
        );
    }

    // 4️⃣ 인증 정보 삭제
    public int deleteAuth(String memberId) {
        return sqlSession.delete(
            NAMESPACE + "deleteAuth",
            memberId
        );
    }
}

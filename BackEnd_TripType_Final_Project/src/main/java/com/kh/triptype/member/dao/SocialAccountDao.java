package com.kh.triptype.member.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.kh.triptype.member.model.vo.Member;

@Repository
public class SocialAccountDao {

    private static final String NAMESPACE = "socialAccountMapper.";

    @Autowired
    private SqlSession sqlSession;

    // 소셜 계정으로 회원 조회
    public Member findByProviderAndUid(String provider, String providerUid) {
        return sqlSession.selectOne(
            NAMESPACE + "findByProviderAndUid",
            java.util.Map.of(
                "provider", provider,
                "providerUid", providerUid
            )
        );
    }

    // 소셜 계정 연동
    public int insertSocialAccount(
        int memberNo,
        String provider,
        String providerUid,
        String email
    ) {
        return sqlSession.insert(
            NAMESPACE + "insertSocialAccount",
            java.util.Map.of(
                "memberNo", memberNo,
                "provider", provider,
                "providerUid", providerUid,
                "email", email
            )
        );
    }
}

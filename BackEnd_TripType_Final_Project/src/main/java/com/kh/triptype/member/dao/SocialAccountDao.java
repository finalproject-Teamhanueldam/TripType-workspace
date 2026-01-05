package com.kh.triptype.member.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.kh.triptype.member.model.vo.Member;
import com.kh.triptype.mypage.model.dto.MySocialConnectionDto;

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
    
    public List<MySocialConnectionDto> findSocialConnectionsByMemberNo(int memberNo) {
        return sqlSession.selectList(
            NAMESPACE + "findSocialConnectionsByMemberNo",
            java.util.Map.of("memberNo", memberNo)
        );
    }
    
    public int deleteSocialAccount(int memberNo, String provider) {
        return sqlSession.delete(
            NAMESPACE + "deleteSocialAccount",
            java.util.Map.of(
                "memberNo", memberNo,
                "provider", provider
            )
        );
    }
    
    public int deleteAllByMemberNo(int memberNo) {
        return sqlSession.delete(
            NAMESPACE + "deleteAllByMemberNo",
            memberNo
        );
    }
    
    public boolean existsByMemberNoAndProvider(int memberNo, String provider) {
        Integer count = sqlSession.selectOne(
            NAMESPACE + "existsByMemberNoAndProvider",
            java.util.Map.of(
                "memberNo", memberNo,
                "provider", provider
            )
        );
        return count != null && count > 0;
    }
    
    public boolean existsByProviderAndProviderUid(
    	    String provider,
    	    String providerUid
    	) {
    	    Integer count = sqlSession.selectOne(
    	        NAMESPACE + "existsByProviderAndProviderUid",
    	        java.util.Map.of(
    	            "provider", provider,
    	            "providerUid", providerUid
    	        )
    	    );
    	    return count != null && count > 0;
    }
    
    public Integer findMemberNoByProviderAndUid(String provider, String providerUid) {
        return sqlSession.selectOne(
            NAMESPACE + "findMemberNoByProviderAndUid",
            java.util.Map.of(
                "provider", provider,
                "providerUid", providerUid
            )
        );
    }
}

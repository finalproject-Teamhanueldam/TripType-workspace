package com.kh.triptype.mypage.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.mypage.model.dto.MyProfileRes;
import com.kh.triptype.mypage.model.dto.MyProfileUpdateReq;
import com.kh.triptype.mypage.model.dto.SearchHistoryDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MyPageDao {

    private final SqlSession sqlSession;

    private static final String NAMESPACE = "mypageMapper.";

    public MyProfileRes selectMyProfile(int memberNo) {
        return sqlSession.selectOne(
            NAMESPACE + "selectMyProfile",
            memberNo
        );
    }

    public int updateMyProfile(int memberNo, MyProfileUpdateReq req) {
        return sqlSession.update(
            NAMESPACE + "updateMyProfile",
            new java.util.HashMap<String, Object>() {{
                put("memberNo", memberNo);
                put("req", req);
            }}
        );
    }

    // 🔽 비밀번호 변경 관련

    public String selectPassword(int memberNo) {
        return sqlSession.selectOne(
            NAMESPACE + "selectPassword",
            memberNo
        );
    }

    public int updatePassword(int memberNo, String password) {
        return sqlSession.update(
            NAMESPACE + "updatePassword",
            new java.util.HashMap<String, Object>() {{
                put("memberNo", memberNo);
                put("password", password);
            }}
        );
    }
    
    public int withdrawMember(int memberNo) {
        return sqlSession.update("mypageMapper.withdrawMember", memberNo);
    }

	public static List<SearchHistoryDto> fetchSearchHistory(SqlSessionTemplate sqlSession, int memberNo) {
		
		return sqlSession.selectList("mypageMapper.fetchSearchHistory", memberNo);
	}
}

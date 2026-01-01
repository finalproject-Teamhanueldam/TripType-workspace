package com.kh.triptype.mypage.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.kh.triptype.mypage.model.dto.MyProfileRes;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MyPageDao {

    private final SqlSession sqlSession;

    public MyProfileRes selectMyProfile(int memberNo) {
        return sqlSession.selectOne(
            "mypageMapper.selectMyProfile",
            memberNo
        );
    }
}
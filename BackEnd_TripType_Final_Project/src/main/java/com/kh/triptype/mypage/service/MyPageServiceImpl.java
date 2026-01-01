package com.kh.triptype.mypage.service;

import org.springframework.stereotype.Service;

import com.kh.triptype.mypage.dao.MyPageDao;
import com.kh.triptype.mypage.model.dto.MyProfileRes;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyPageServiceImpl implements MyPageService {

    private final MyPageDao myPageDao;

    @Override
    public MyProfileRes getMyProfile(int memberNo) {
        return myPageDao.selectMyProfile(memberNo);
    }
}
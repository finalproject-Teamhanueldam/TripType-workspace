package com.kh.triptype.mypage.service;

import com.kh.triptype.mypage.model.dto.MyProfileRes;

public interface MyPageService {

    MyProfileRes getMyProfile(int memberNo);

}
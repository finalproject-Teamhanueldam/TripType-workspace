package com.kh.triptype.mypage.service;

import com.kh.triptype.mypage.model.dto.MyPasswordChangeReq;
import com.kh.triptype.mypage.model.dto.MyProfileRes;
import com.kh.triptype.mypage.model.dto.MyProfileUpdateReq;

public interface MyPageService {

    MyProfileRes getMyProfile(int memberNo);

    int updateMyProfile(int memberNo, MyProfileUpdateReq req);
    
    void changePassword(int memberNo, MyPasswordChangeReq req);
    
    void withdraw(int memberNo, String password);
}
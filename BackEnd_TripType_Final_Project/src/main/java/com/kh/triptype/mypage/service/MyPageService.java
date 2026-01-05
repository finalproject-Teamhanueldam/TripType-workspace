package com.kh.triptype.mypage.service;

import java.util.List;

import com.kh.triptype.mypage.model.dto.MyPasswordChangeReq;
import com.kh.triptype.mypage.model.dto.MyProfileRes;
import com.kh.triptype.mypage.model.dto.MyProfileUpdateReq;
import com.kh.triptype.mypage.model.dto.SearchHistoryDto;
import com.kh.triptype.mypage.model.dto.WishItemDto;

public interface MyPageService {

    MyProfileRes getMyProfile(int memberNo);

    int updateMyProfile(int memberNo, MyProfileUpdateReq req);

    void changePassword(int memberNo, MyPasswordChangeReq req);

    void withdraw(int memberNo, String password);

    List<SearchHistoryDto> fetchSearchHistory(int memberNo);

    void unlinkSocial(int memberNo, String provider);
    
    List<WishItemDto> fetchWishlist(int memberNo);
}
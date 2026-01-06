package com.kh.triptype.mypage.service;

public interface MySocialService {
	
    void linkSocial(int memberNo, String provider);
    
    void prepareLink(int memberNo, String provider);
    
}
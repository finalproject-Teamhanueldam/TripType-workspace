package com.kh.triptype.mypage.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.kh.triptype.mypage.dao.MyPageDao;
import com.kh.triptype.mypage.model.dto.MyPasswordChangeReq;
import com.kh.triptype.mypage.model.dto.MyProfileRes;
import com.kh.triptype.mypage.model.dto.MyProfileUpdateReq;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyPageServiceImpl implements MyPageService {

    private final MyPageDao myPageDao;
    private final PasswordEncoder passwordEncoder;

    @Override
    public MyProfileRes getMyProfile(int memberNo) {
        return myPageDao.selectMyProfile(memberNo);
    }
    
    @Override
    public int updateMyProfile(int memberNo, MyProfileUpdateReq req) {
        return myPageDao.updateMyProfile(memberNo, req);
    }
    
    @Override
    public void changePassword(int memberNo, MyPasswordChangeReq req) {

        String originPw = myPageDao.selectPassword(memberNo);

        if (!passwordEncoder.matches(req.getCurrentPassword(), originPw)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "INVALID_PASSWORD"
            );
        }
        
        if (passwordEncoder.matches(req.getNewPassword(), originPw)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "SAME_PASSWORD"
            );
        }
            
        String encoded = passwordEncoder.encode(req.getNewPassword());
        myPageDao.updatePassword(memberNo, encoded);
    }
    
    @Override
    public void withdraw(int memberNo, String password) {

        String originPw = myPageDao.selectPassword(memberNo);

        if (originPw == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "ALREADY_WITHDRAWN"
            );
        }

        if (!passwordEncoder.matches(password, originPw)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "INVALID_PASSWORD"
            );
        }

        myPageDao.withdrawMember(memberNo);
    }
}
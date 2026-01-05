package com.kh.triptype.mypage.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.kh.triptype.member.dao.SocialAccountDao;
import com.kh.triptype.mypage.dao.MyPageDao;
import com.kh.triptype.mypage.model.dto.MyPasswordChangeReq;
import com.kh.triptype.mypage.model.dto.MyProfileRes;
import com.kh.triptype.mypage.model.dto.MyProfileUpdateReq;
import com.kh.triptype.mypage.model.dto.SearchHistoryDto;
import com.kh.triptype.mypage.model.dto.WishItemDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyPageServiceImpl implements MyPageService {

    private final MyPageDao myPageDao;
    private final PasswordEncoder passwordEncoder;
    private final SocialAccountDao socialAccountDao;

    @Override
    public MyProfileRes getMyProfile(int memberNo) {
        MyProfileRes res = myPageDao.selectMyProfile(memberNo);

        res.setSocialConnections(
            socialAccountDao.findSocialConnectionsByMemberNo(memberNo)
        );

        res.setHasPassword(myPageDao.selectPassword(memberNo) != null);
        return res;
    }

    @Override
    public int updateMyProfile(int memberNo, MyProfileUpdateReq req) {
        return myPageDao.updateMyProfile(memberNo, req);
    }

    @Override
    public void changePassword(int memberNo, MyPasswordChangeReq req) {
        String originPw = myPageDao.selectPassword(memberNo);

        if (originPw == null) {
            myPageDao.updatePassword(
                memberNo,
                passwordEncoder.encode(req.getNewPassword())
            );
            return;
        }

        if (!passwordEncoder.matches(req.getCurrentPassword(), originPw)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "INVALID_PASSWORD");
        }

        myPageDao.updatePassword(
            memberNo,
            passwordEncoder.encode(req.getNewPassword())
        );
    }

    @Override
    public void withdraw(int memberNo, String password) {
        String originPw = myPageDao.selectPassword(memberNo);

        if (originPw != null &&
            !passwordEncoder.matches(password, originPw)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "INVALID_PASSWORD");
        }

        socialAccountDao.deleteAllByMemberNo(memberNo);
        myPageDao.withdrawMember(memberNo);
    }

    @Override
    public List<SearchHistoryDto> fetchSearchHistory(int memberNo) {
        return myPageDao.fetchSearchHistory(memberNo);
    }

    @Override
    public void unlinkSocial(int memberNo, String provider) {

        var socials = socialAccountDao.findSocialConnectionsByMemberNo(memberNo);
        boolean hasPassword = myPageDao.selectPassword(memberNo) != null;

        boolean isLinked = socials.stream()
            .anyMatch(s -> s.getProvider().equals(provider));

        if (!isLinked) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "NOT_CONNECTED");
        }

        if (!hasPassword && socials.size() <= 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "LAST_LOGIN_METHOD");
        }

        socialAccountDao.deleteSocialAccount(memberNo, provider);
    }
    
    @Override
    public List<WishItemDto> fetchWishlist(int memberNo) {
        return myPageDao.selectWishlist(memberNo);
    }
}
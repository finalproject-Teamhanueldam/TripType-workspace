package com.kh.triptype.mypage.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.kh.triptype.auth.kakao.KakaoOAuthClient;
import com.kh.triptype.auth.kakao.KakaoUserInfo;
import com.kh.triptype.member.dao.SocialAccountDao;
import com.kh.triptype.member.model.vo.Member;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MySocialServiceImpl implements MySocialService {

    private final SocialAccountDao socialAccountDao;
    private final KakaoOAuthClient kakaoOAuthClient;

    @Override
    public void linkSocial(int memberNo, String provider) {

        boolean exists =
            socialAccountDao.existsByMemberNoAndProvider(memberNo, provider);

        if (exists) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "ALREADY_CONNECTED"
            );
        }

        // ⚠️ 실제 소셜 insert는 OAuth 로그인 성공 시
        // 여기서는 "연동 시작 가능 여부"만 검증
    }
    
    @Override
    public void prepareLink(int memberNo, String provider) {
        // 👉 지금은 아무것도 안 해도 됨
        // (연동 버튼 누른 시점에서 로그인 상태 보장용)
    }

    @Override
    public void completeLink(int memberNo, String provider, String code) {

        // 1️⃣ code → accessToken
        String accessToken = kakaoOAuthClient.getAccessToken(code);

        // 2️⃣ 카카오 사용자 정보
        KakaoUserInfo userInfo = kakaoOAuthClient.getUserInfo(accessToken);
        String providerUid = userInfo.getId();

        // 3️⃣ 이미 이 소셜 계정이 연동된 회원이 있는지 확인
        Member existingMember =
            socialAccountDao.findByProviderAndUid(provider, providerUid);

        // ✅ 이미 "다른 회원"에 연동된 경우 → 차단
        if (existingMember != null && existingMember.getMemberNo() != memberNo) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "ALREADY_LINKED_TO_OTHER_MEMBER"
            );
        }

        // ✅ 이미 "같은 회원"에 연동된 경우 → 차단 or 무시
        if (existingMember != null && existingMember.getMemberNo() == memberNo) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "ALREADY_CONNECTED"
            );
        }

        // 4️⃣ 문제 없으면 연동
        socialAccountDao.insertSocialAccount(
            memberNo,
            provider,
            providerUid,
            userInfo.getEmail()
        );
    }
}

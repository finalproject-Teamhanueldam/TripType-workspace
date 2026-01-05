package com.kh.triptype.auth.oauth;

import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.kh.triptype.member.dao.MemberDao;
import com.kh.triptype.member.dao.SocialAccountDao;
import com.kh.triptype.member.model.vo.Member;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService
        implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final MemberDao memberDao;
    private final SocialAccountDao socialAccountDao;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest)
            throws OAuth2AuthenticationException {

        // ✅ 현재 요청 객체
        HttpServletRequest request =
            ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();

        // ✅✅✅ link/login 모드 판별: request param(state) 금지, 세션 플래그만 사용
        HttpSession session = request.getSession(false);
        boolean isLinkMode = session != null && Boolean.TRUE.equals(session.getAttribute("OAUTH_LINK_MODE"));

        // OAuth2 기본 사용자 정보 로드
        OAuth2User oauth2User = new DefaultOAuth2UserService().loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId(); // kakao / naver
        String providerForDb = provider.toUpperCase(); // KAKAO / NAVER

        OAuthAttributes parsed = OAuthAttributes.of(provider, oauth2User.getAttributes());

        if (parsed.getEmail() == null || parsed.getEmail().isBlank()) {
            throw new OAuth2AuthenticationException(
                new OAuth2Error("OAUTH_EMAIL_REQUIRED"),
                "소셜 로그인 정보 제공에 동의해주세요."
            );
        }

        // provider + uid로 기존 소셜 계정 조회
        Member linkedMember = socialAccountDao.findByProviderAndUid(
            providerForDb,
            parsed.getProviderId()
        );

        /* ===============================
           🔥 소셜 연동(link) 모드
        =============================== */
        if (isLinkMode) {
        	System.out.println("LINK MODE = " + isLinkMode);
        	System.out.println("SESSION ID = " + session.getId());
        	System.out.println("LINK MEMBER NO = " + session.getAttribute("OAUTH_LINK_MEMBER_NO"));
        	
            Integer currentLoginMemberNo = (Integer) session.getAttribute("OAUTH_LINK_MEMBER_NO");

            // ✅ 연동 주체 없으면 연동 불가
            if (currentLoginMemberNo == null) {
                throw new OAuth2AuthenticationException(
                    new OAuth2Error("LOGIN_REQUIRED"),
                    "연동은 로그인 상태에서만 가능합니다."
                );
            }

            // ✅ 이미 다른 계정에 연동된 소셜이면 차단
            if (linkedMember != null && linkedMember.getMemberNo() != currentLoginMemberNo) {
                throw new OAuth2AuthenticationException(
                    new OAuth2Error("ALREADY_LINKED"),
                    "이미 다른 계정에 연동된 소셜 계정입니다."
                );
            }

            // ✅ 내 계정에 이미 같은 provider가 연동되어 있으면 차단
            boolean exists = socialAccountDao.existsByMemberNoAndProvider(
                currentLoginMemberNo,
                providerForDb
            );
            if (exists) {
                throw new OAuth2AuthenticationException(
                    new OAuth2Error("ALREADY_CONNECTED"),
                    "이미 연동된 소셜 계정입니다."
                );
            }

            // ✅ 정상 연동
            socialAccountDao.insertSocialAccount(
                currentLoginMemberNo,
                providerForDb,
                parsed.getProviderId(),
                parsed.getEmail()
            );

            // ✅ link 모드는 “로그인”이 아님. 기존 회원을 그대로 내려줌
            Member me = memberDao.findByMemberNo(currentLoginMemberNo);
            return buildOAuth2User(me);
        }

        /* ===============================
           소셜 로그인 모드
        =============================== */

        // 이미 연동된 소셜 계정 → 해당 회원으로 로그인
        if (linkedMember != null) {
            return buildOAuth2User(linkedMember);
        }

        // 이메일로 기존 회원 찾기(탈퇴 포함)
        Member member = memberDao.findByMemberIdIncludingWithdrawn(parsed.getEmail());

        if (member != null) {
            if ("N".equals(member.getMemberIsActive())) {
                memberDao.reactivateMember(member.getMemberNo());
            }

            socialAccountDao.insertSocialAccount(
                member.getMemberNo(),
                providerForDb,
                parsed.getProviderId(),
                parsed.getEmail()
            );

            return buildOAuth2User(member);
        }

        // 신규 소셜 회원 생성
        Member newMember = new Member();
        newMember.setMemberId(parsed.getEmail());
        newMember.setMemberName(parsed.getName());
        newMember.setMemberRole("USER");
        newMember.setMemberPassword(null);

        memberDao.insertSocialMember(newMember);

        socialAccountDao.insertSocialAccount(
            newMember.getMemberNo(),
            providerForDb,
            parsed.getProviderId(),
            parsed.getEmail()
        );

        return buildOAuth2User(newMember);
    }

    private OAuth2User buildOAuth2User(Member member) {
        return new DefaultOAuth2User(
            List.of(new SimpleGrantedAuthority("ROLE_" + member.getMemberRole())),
            Map.of(
                "memberNo", member.getMemberNo(),
                "memberRole", member.getMemberRole()
            ),
            "memberNo"
        );
    }
}

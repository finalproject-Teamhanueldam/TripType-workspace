package com.kh.triptype.auth.oauth;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

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

        OAuth2User oauth2User =
            new DefaultOAuth2UserService().loadUser(userRequest);

        String provider =
            userRequest.getClientRegistration().getRegistrationId();

        Map<String, Object> attributes = oauth2User.getAttributes();

        OAuthAttributes parsed =
            OAuthAttributes.of(provider, attributes);

        // 1️ 소셜 계정으로 먼저 조회
        Member member = socialAccountDao.findByProviderAndUid(
            parsed.getProvider(),
            parsed.getProviderId()
        );

        if (member == null) {

            // 2️ 이메일(memberId)로 기존 일반 회원 조회
            member = memberDao.findByMemberId(parsed.getEmail());

            if (member != null) {
                // 기존 회원에 소셜 계정 연동
                socialAccountDao.insertSocialAccount(
                    member.getMemberNo(),
                    parsed.getProvider(),
                    parsed.getProviderId(),
                    parsed.getEmail()
                );
            } else {
                // 신규 소셜 회원
                Member newMember = new Member();
                newMember.setMemberId(parsed.getEmail());
                newMember.setMemberName(parsed.getName());
                newMember.setMemberRole("USER");
                
                System.out.println("🔥 SOCIAL EMAIL = " + parsed.getEmail());
                System.out.println("🔥 MEMBER_ID = " + newMember.getMemberId());
                
                // 소셜 로그인은 비밀번호 없음
                newMember.setMemberPassword(null);
                
                memberDao.insertSocialMember(newMember);

                socialAccountDao.insertSocialAccount(
                    newMember.getMemberNo(),
                    parsed.getProvider(),
                    parsed.getProviderId(),
                    parsed.getEmail()
                );

                member = newMember;
            }
        }

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

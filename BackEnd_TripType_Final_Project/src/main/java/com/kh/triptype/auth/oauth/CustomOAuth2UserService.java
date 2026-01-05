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

        // 0. OAuth2 기본 사용자 정보 로드
        OAuth2User oauth2User =
                new DefaultOAuth2UserService().loadUser(userRequest);

        String provider =
                userRequest.getClientRegistration().getRegistrationId();

        Map<String, Object> attributes = oauth2User.getAttributes();

        OAuthAttributes parsed =
                OAuthAttributes.of(provider, attributes);

        // 1. 소셜 계정 (provider + providerId) 기준으로 먼저 조회
        Member member = socialAccountDao.findByProviderAndUid(
                parsed.getProvider(),
                parsed.getProviderId()
        );

        if (member != null) {
            // ✅ 이미 소셜 계정이 연동된 회원
            return buildOAuth2User(member);
        }

        // 2. 이메일(memberId) 기준으로 기존 일반 회원 조회
        member = memberDao.findByMemberId(parsed.getEmail());

        if (member != null) {
            // ✅ 기존 일반 회원 → 소셜 계정만 연동 (TB_MEMBER 수정 ❌)
            socialAccountDao.insertSocialAccount(
                    member.getMemberNo(),
                    parsed.getProvider(),
                    parsed.getProviderId(),
                    parsed.getEmail()
            );

            // 🔥 반드시 여기서 종료 (신규 회원 로직 진입 차단)
            return buildOAuth2User(member);
        }

        // 3. 완전 신규 소셜 회원 (이메일 자체가 없음)
        Member newMember = new Member();
        newMember.setMemberId(parsed.getEmail());
        newMember.setMemberName(parsed.getName());
        newMember.setMemberRole("USER");

        // 소셜 로그인은 비밀번호 없음
        newMember.setMemberPassword(null);

        // ❗ insert 전용 (절대 update / merge 사용 금지)
        memberDao.insertSocialMember(newMember);

        // 소셜 계정 연동
        socialAccountDao.insertSocialAccount(
                newMember.getMemberNo(),
                parsed.getProvider(),
                parsed.getProviderId(),
                parsed.getEmail()
        );

        return buildOAuth2User(newMember);
    }

    /**
     * OAuth2User 공통 생성 메서드
     */
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

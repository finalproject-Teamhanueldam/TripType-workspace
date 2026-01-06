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
        
        // :경고: 실제 소셜 insert는 OAuth 로그인 성공 시
        // 여기서는 "연동 시작 가능 여부"만 검증
    }
    
    @Override
    public void prepareLink(int memberNo, String provider) {
        // :오른쪽을_가리키는_손_모양: 지금은 아무것도 안 해도 됨
        // (연동 버튼 누른 시점에서 로그인 상태 보장용)
    }
}
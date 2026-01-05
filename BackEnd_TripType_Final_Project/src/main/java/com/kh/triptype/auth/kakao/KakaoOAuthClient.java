package com.kh.triptype.auth.kakao;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Component
public class KakaoOAuthClient {

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String clientSecret;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    private static final String TOKEN_URL = "https://kauth.kakao.com/oauth/token";
    private static final String USER_INFO_URL = "https://kapi.kakao.com/v2/user/me";

    public String getAccessToken(String code) {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", "http://localhost:8001/triptype/api/oauth/link/kakao");
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request =
            new HttpEntity<>(params, headers);

        KakaoTokenResponse response =
            restTemplate.postForObject(TOKEN_URL, request, KakaoTokenResponse.class);

        return response.getAccess_token();
    }

    @SuppressWarnings("unchecked")
    public KakaoUserInfo getUserInfo(String accessToken) {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        Map<String, Object> response =
            restTemplate.postForObject(USER_INFO_URL, request, Map.class);

        String id = String.valueOf(response.get("id"));

        Map<String, Object> account =
            (Map<String, Object>) response.get("kakao_account");

        String email = (account != null)
            ? (String) account.get("email")
            : null;

        return new KakaoUserInfo(id, email);
    }
}

package com.kh.triptype.auth.oauth;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OAuthAttributes {

    private String provider;
    private String providerId;
    private String email;
    private String name;
    private String nameAttributeKey;

    public static OAuthAttributes of(String provider, Map<String, Object> attributes) {

        if ("naver".equals(provider)) {
            Map<String, Object> res =
                (Map<String, Object>) attributes.get("response");

            return new OAuthAttributes(
                "naver",
                (String) res.get("id"),
                (String) res.get("email"),
                (String) res.get("name"),
                "id"
            );
        }

        if ("kakao".equals(provider)) {
            Map<String, Object> account =
                (Map<String, Object>) attributes.get("kakao_account");
            Map<String, Object> profile =
                (Map<String, Object>) account.get("profile");

            return new OAuthAttributes(
                "kakao",
                String.valueOf(attributes.get("id")),
                (String) account.get("email"),
                (String) profile.get("nickname"),
                "id"
            );
        }

        throw new IllegalArgumentException("Unsupported provider");
    }
}


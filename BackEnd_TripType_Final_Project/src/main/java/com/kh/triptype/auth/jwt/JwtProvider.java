package com.kh.triptype.auth.jwt;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtProvider {

    // 최소 32byte 이상 필요 (HS256)
    private static final String SECRET_KEY =
            "TripTypeJwtSecretKeyForFinalProject2025!!!";

    // Access Token 유효시간: 30분
    private static final long EXPIRATION_TIME = 1000L * 60 * 30;

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // 토큰 생성: memberNo + role 저장
    public String createToken(int memberNo, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .setSubject(String.valueOf(memberNo)) // memberNo를 subject로
                .claim("role", role)                  // 권한
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 토큰 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Claims 추출
    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    // memberNo 추출 (subject)
    public int getMemberNo(String token) {
        return Integer.parseInt(getClaims(token).getSubject());
    }

    // role 추출
    public String getRole(String token) {
        return getClaims(token).get("role", String.class);
    }
}

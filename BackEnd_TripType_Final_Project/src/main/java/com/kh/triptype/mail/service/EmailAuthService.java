package com.kh.triptype.mail.service;

import java.util.HashMap;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailAuthService {

    @Autowired
    private SqlSession sqlSession;

    @Autowired
    private JavaMailSender mailSender;

    /**
     * 인증번호 생성 + DB 저장 + 메일 발송
     */
    public void sendAuthMail(String email) {
    	
    	// 1. 이메일 중복 검사
        Integer count = sqlSession.selectOne(
            "memberMapper.countByMemberId",
            email
        );

        if (count != null && count > 0) {
            throw new IllegalStateException("이미 가입된 이메일입니다.");
        }
    	
        // 2. 인증번호 생성
        String authCode = generateCode();

        // 3. 기존 인증번호 삭제 (재발송 대비)
        sqlSession.delete(
            "emailAuthMapper.deleteAuth",
            Map.of("authEmail", email)
        );

        // 4. 인증번호 DB 저장
        sqlSession.insert(
            "emailAuthMapper.insertAuth",
            Map.of(
                "authEmail", email,
                "authCode", authCode
            )
        );

        // 5. 메일 발송
        sendMail(email, authCode);
        
    }

    /**
     * 인증번호 검증
     */
    public boolean verifyAuthCode(String email, String code) {

        Map<String, Object> param = new HashMap<>();
        param.put("authEmail", email);
        param.put("authCode", code);
        param.put("expireMinutes", 5);

        Integer count = sqlSession.selectOne(
            "emailAuthMapper.countValidAuth",
            param
        );

        if (count != null && count > 0) {
            // 인증 성공 → 상태 저장
            sqlSession.update(
                "emailAuthMapper.markVerified",
                Map.of("authEmail", email)
            );
            return true;
        }

        return false;
    }

    /**
     * 인증번호 생성
     */
    private String generateCode() {
        return String.valueOf((int)(Math.random() * 900000) + 100000);
    }

    /**
     * 메일 발송 (내부 전용)
     */
    private void sendMail(String toEmail, String authCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("[TripType] 이메일 인증번호 안내");
            message.setText(
                "안녕하세요.\n\n" +
                "TripType 이메일 인증번호는 아래와 같습니다.\n\n" +
                "인증번호 : " + authCode + "\n\n" +
                "※ 본 인증번호는 5분간 유효합니다."
            );

            mailSender.send(message);

        } catch (Exception e) {
            e.printStackTrace();
            throw new IllegalStateException("메일 전송에 실패했습니다.");
        }
    }
}

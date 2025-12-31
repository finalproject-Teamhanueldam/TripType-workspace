package com.kh.triptype.member.service;

import java.util.List;

import com.kh.triptype.member.model.dto.MemberJoinRequestDto;

public interface MemberService {
	
	// 회원가입
	void join(MemberJoinRequestDto req);
	
	// 비밀번호 재설정
	void resetPassword(
	        String memberName,
	        String memberId,
	        String newPassword
	    );
	
	// 아이디(이메일) 찾기
	List<String> findMemberIds(
            String memberName,
            String memberBirthDate
    );
	
	
}

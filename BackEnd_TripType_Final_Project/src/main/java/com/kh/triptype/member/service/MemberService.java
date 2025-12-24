package com.kh.triptype.member.service;

import com.kh.triptype.member.model.dto.MemberJoinRequestDto;

public interface MemberService {
	
	void join(MemberJoinRequestDto req);
	
}

package com.kh.triptype.member.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.member.model.dto.MemberJoinRequestDto;
import com.kh.triptype.member.model.dto.MemberUnlockRequest;
import com.kh.triptype.member.service.MemberService;

@RestController
@RequestMapping("/member")
@CrossOrigin(origins = "http://localhost:5173")
public class MemberController {

    @Autowired
    private MemberService memberService;
    
    
    // 프론트요청을 받아 JSON 데이터를 MemberJoinRequestDto 객체
    // DTO는 controller에서 만들어져서 service로 보내기만 함
    // ResponseEntity<Void> 응답 본문(body)이 없는 HTTP 응답
    // 만약 ResponseEntitiy<MemberDto> 형태였으면 JSON으로 변환되는 객체가 있음
    // RequestBody는 요청 json을 dto로 보낸다
    // ResponseEntitiy는 응답 전체(상태코드 + body)
    @PostMapping("/join")
    public ResponseEntity<Void> join(@RequestBody MemberJoinRequestDto req) {
        memberService.join(req); // join메소드 호출
        return ResponseEntity.status(HttpStatus.CREATED).build();
        // 응답 body는 없고 상태코드만 보내겠다
        // 실제 응답 예시 HTTP/1.1 201 Created
    }
    
    @PostMapping("/password/reset")
    public ResponseEntity<Void> resetPassword(
            @RequestBody Map<String, String> body
    ) {
        memberService.resetPassword(
            body.get("memberName"),
            body.get("memberId"),
            body.get("newPassword")
        );

        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/id/find")
    public ResponseEntity<Map<String, Object>> findId(
            @RequestBody Map<String, String> body
    ) {
    	
    	List<String> ids = memberService.findMemberIds(
	        body.get("memberName"),
	        body.get("memberBirthDate")
	    );

	    return ResponseEntity.ok(
	        Map.of("memberIds", ids)
	    );
    }
    
    @PostMapping("/unlock")
    public ResponseEntity<Void> unlockMember(
            @RequestBody MemberUnlockRequest req
    ) {
        memberService.unlockMember(req);
        return ResponseEntity.ok().build();
    }
}

package com.kh.triptype.admin.member.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.admin.member.model.dto.AdminMemberDeactivateRequestDto;
import com.kh.triptype.admin.member.model.dto.AdminMemberDetailResponseDto;
import com.kh.triptype.admin.member.model.dto.AdminMemberListResponseDto;
import com.kh.triptype.admin.member.model.dto.AdminMemberUnlockRequestDto;
import com.kh.triptype.admin.member.service.AdminMemberService;
import com.kh.triptype.auth.model.vo.AuthUser;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/member")
@RequiredArgsConstructor
public class AdminMemberController {

    private final AdminMemberService adminMemberService;
    
    // 관리자가 관리자를 비활성화하는걸 막기 위해 추가
    private int getLoginMemberNo() {
        Authentication auth =
            SecurityContextHolder.getContext().getAuthentication();

        AuthUser user = (AuthUser) auth.getPrincipal();
        return user.getMemberNo();
    }
    
    /* 회원 목록 */
    @GetMapping
    public AdminMemberListResponseDto getMemberList(
        @RequestParam(required = false) String keyword,
        @RequestParam(defaultValue = "false") boolean showInactive
    ) {
        return adminMemberService.getMemberList(keyword, showInactive);
    }

    /* 회원 상세 */
    @GetMapping("/{memberNo}")
    public AdminMemberDetailResponseDto getMemberDetail(
        @PathVariable int memberNo
    ) {
        return adminMemberService.getMemberDetail(memberNo);
    }

    /* 잠금 해제 */
    @PutMapping("/unlock")
    public void unlockMembers(
        @RequestBody AdminMemberUnlockRequestDto req
    ) {
        adminMemberService.unlockMembers(req.getMemberNos());
    }

    /* 비활성화 */
    @PutMapping("/deactivate")
    public void deactivateMembers(
        @RequestBody AdminMemberDeactivateRequestDto req
    ) {
    	int adminNo = getLoginMemberNo();
        adminMemberService.deactivateMembers(req.getMemberNos(), adminNo);
    }
}

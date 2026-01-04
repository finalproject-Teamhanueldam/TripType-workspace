package com.kh.triptype.admin.member.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kh.triptype.admin.member.dao.AdminMemberDao;
import com.kh.triptype.admin.member.model.dto.AdminMemberDetailResponseDto;
import com.kh.triptype.admin.member.model.dto.AdminMemberListResponseDto;
import com.kh.triptype.admin.member.model.vo.AdminMember;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminMemberServiceImpl implements AdminMemberService {

    private final AdminMemberDao adminMemberDao;

    @Override
    public AdminMemberListResponseDto getMemberList(String keyword, boolean showInactive) {

        List<AdminMember> list =
            adminMemberDao.selectMemberList(keyword, showInactive);

        return new AdminMemberListResponseDto(list);
    }

    @Override
    public AdminMemberDetailResponseDto getMemberDetail(int memberNo) {

        AdminMember member =
            adminMemberDao.selectMemberDetail(memberNo);

        return new AdminMemberDetailResponseDto(member);
    }

    @Override
    public void unlockMembers(List<Integer> memberNos) {
        adminMemberDao.unlockMembers(memberNos);
    }

    @Override
    public void deactivateMembers(List<Integer> memberNos, int adminNo) {

    	// 관리자 계정 포함 여부 검사
        List<Integer> adminTargets =
            adminMemberDao.selectAdminMemberNos(memberNos);

        if (!adminTargets.isEmpty()) {
            throw new IllegalStateException(
                "관리자 계정은 비활성화할 수 없습니다."
            );
        }

        adminMemberDao.deactivateMembers(memberNos);
    }
}

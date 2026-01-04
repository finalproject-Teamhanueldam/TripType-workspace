package com.kh.triptype.admin.member.service;

import com.kh.triptype.admin.member.model.dto.*;
import java.util.List;

public interface AdminMemberService {

    AdminMemberListResponseDto getMemberList(String keyword, boolean showInactive);

    AdminMemberDetailResponseDto getMemberDetail(int memberNo);

    void unlockMembers(List<Integer> memberNos);

    void deactivateMembers(List<Integer> memberNos, int adminNo);
}

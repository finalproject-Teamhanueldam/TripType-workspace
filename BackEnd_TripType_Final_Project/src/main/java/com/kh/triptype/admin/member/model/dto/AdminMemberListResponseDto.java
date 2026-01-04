package com.kh.triptype.admin.member.model.dto;

import java.util.List;
import com.kh.triptype.admin.member.model.vo.AdminMember;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminMemberListResponseDto {

    private List<AdminMember> list;
}

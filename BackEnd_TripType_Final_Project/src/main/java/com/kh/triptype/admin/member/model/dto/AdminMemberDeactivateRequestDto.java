package com.kh.triptype.admin.member.model.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminMemberDeactivateRequestDto {

    private List<Integer> memberNos;
}
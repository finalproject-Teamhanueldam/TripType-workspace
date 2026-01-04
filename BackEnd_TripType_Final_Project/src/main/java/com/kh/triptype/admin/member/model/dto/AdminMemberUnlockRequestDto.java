package com.kh.triptype.admin.member.model.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminMemberUnlockRequestDto {

    private List<Integer> memberNos;
}

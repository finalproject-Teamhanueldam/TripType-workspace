package com.kh.triptype.admin.member.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.admin.member.model.vo.AdminMember;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AdminMemberDao {

    private final SqlSessionTemplate sqlSession;

    private static final String NAMESPACE = "adminMemberMapper.";

    public List<AdminMember> selectMemberList(String keyword, boolean showInactive) {
    	Map<String, Object> param = new HashMap<>();
        param.put("keyword", keyword);
        param.put("showInactive", showInactive);

        return sqlSession.selectList(
            NAMESPACE + "selectMemberList",
            param
        );
    }
    
    // 관리자가 관리자 비활성화하는것을 막기 위함
    public List<Integer> selectAdminMemberNos(List<Integer> memberNos) {
        return sqlSession.selectList(
            NAMESPACE + "selectAdminMemberNos",
            memberNos
        );
    }

    public AdminMember selectMemberDetail(int memberNo) {
        return sqlSession.selectOne(
            NAMESPACE + "selectMemberDetail",
            memberNo
        );
    }

    public void unlockMembers(List<Integer> memberNos) {
        sqlSession.update(
            NAMESPACE + "unlockMembers",
            memberNos
        );
    }

    public void deactivateMembers(List<Integer> memberNos) {
        sqlSession.update(
            NAMESPACE + "deactivateMembers",
            memberNos
        );
    }
}

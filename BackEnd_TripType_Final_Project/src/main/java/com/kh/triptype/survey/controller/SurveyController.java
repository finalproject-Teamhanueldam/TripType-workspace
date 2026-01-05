package com.kh.triptype.survey.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.kh.triptype.auth.model.vo.AuthUser;
import com.kh.triptype.survey.model.dto.SurveySaveRequestDto;
import com.kh.triptype.survey.model.vo.SurveyVo;
import com.kh.triptype.survey.service.SurveyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/survey")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SurveyController {

    private final SurveyService surveyService;

    /** 설문 결과 저장 (로그인 필수) */
    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveSurvey(@RequestBody SurveySaveRequestDto dto) {

        Long memberNo = resolveMemberNoOrNull();
        if (memberNo == null) {
            return ResponseEntity.status(401).body(fail("로그인이 필요합니다."));
        }

        int result = surveyService.saveOrUpdateSurvey(memberNo, dto);

        Map<String, Object> res = new HashMap<>();
        res.put("success", result > 0);
        res.put("memberNo", memberNo);
        return ResponseEntity.ok(res);
    }

    /** 내 설문 조회 (로그인 필수) */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMySurvey() {

        Long memberNo = resolveMemberNoOrNull();
        if (memberNo == null) {
            return ResponseEntity.status(401).body(fail("로그인이 필요합니다."));
        }

        SurveyVo vo = surveyService.selectSurveyByMemberNo(memberNo);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("exists", vo != null);
        res.put("data", vo);
        return ResponseEntity.ok(res);
    }

    /* =========================================================
       SecurityContext에서 memberNo 꺼내기
       ========================================================= */
    private Long resolveMemberNoOrNull() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;

        Object principal = auth.getPrincipal();
        if (principal == null) return null;

        if (principal instanceof String) return null; // anonymousUser

        if (principal instanceof AuthUser user) {
            return Long.valueOf(user.getMemberNo());
        }

        return null;
    }

    private Map<String, Object> fail(String message) {
        Map<String, Object> res = new HashMap<>();
        res.put("success", false);
        res.put("message", message);
        return res;
    }
}

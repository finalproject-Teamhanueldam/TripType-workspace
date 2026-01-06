package com.kh.triptype.admin.pricing.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// ✅✅ [추가] JWT 인증정보에서 memberNo 꺼내기 위해 필요
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.kh.triptype.admin.pricing.model.dto.FlightSearchRequestDto;
import com.kh.triptype.admin.pricing.service.FlightSearchService;
import com.kh.triptype.airline.model.vo.AirlineListVo;

// ✅✅ [추가] 네 JwtAuthenticationFilter가 principal로 넣는 클래스
import com.kh.triptype.auth.model.vo.AuthUser;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://192.168.150.180:5173")
public class FlightSearchController {

    private final FlightSearchService flightSearchService;

    /**
     * =========================================================
     * ✅✅ [수정 1] 로그인/비로그인 모두 고려한 검색 시작 (즉시 응답)
     *
     * - 비로그인도 검색 가능해야 하므로:
     *   ✅ Authorization 헤더가 없으면 memberNo는 null로 유지
     *
     * - 로그인 사용자(JWT 존재):
     *   ✅ JwtAuthenticationFilter가 SecurityContext에 AuthUser(memberNo, role)를 넣어둠
     *   ✅ 여기서 AuthUser.memberNo를 꺼내 request.memberNo에 주입
     *
     * - 프론트에서 memberNo를 굳이 내려보낼 필요 없음(위변조 위험)
     * =========================================================
     */
    @PostMapping("/search")
    public ResponseEntity<SearchStartResponseDto> searchFlights(
            @RequestBody FlightSearchRequestDto request
    ) {
        System.out.println("========================================");
        System.out.println("✈️ [FlightSearchController] POST /api/flights/search");
        System.out.println("✅ 요청 수신: " + request);

        /* =========================================================
           ✅✅ [수정 2] JWT 기반 memberNo 자동 주입 (핵심)
           - 토큰이 있으면: memberNo 주입
           - 토큰이 없으면: null 유지 (비로그인 검색)
           - 절대 하드코딩(1L) 하지 않음
           ========================================================= */
        Long memberNo = resolveMemberNoOrNull();
        request.setMemberNo(memberNo);

        System.out.println("✅ memberNo 주입 결과: " + memberNo);

        String searchId = flightSearchService.startSearchAsync(request);

        System.out.println("✅ searchId 발급 완료: " + searchId);
        System.out.println("========================================");

        return ResponseEntity.accepted().body(new SearchStartResponseDto(searchId));
    }

    /**
     * =========================================================
     * ✅ 결과 조회 (목록 페이지에서 polling)
     *
     * - 아직 결과가 준비 안 됐으면:
     *   202 + {searchId, status:PENDING}
     *
     * - 준비되면:
     *   200 + List<AirlineListVo>
     * =========================================================
     */
    @GetMapping("/search/{searchId}")
    public ResponseEntity<?> getSearchResult(@PathVariable String searchId) {

        System.out.println("========================================");
        System.out.println("✈️ [FlightSearchController] GET /api/flights/search/" + searchId);

        List<AirlineListVo> result = flightSearchService.getSearchResult(searchId);

        if (result == null) {
            System.out.println("⏳ 아직 준비 안 됨: " + searchId);
            System.out.println("========================================");

            return ResponseEntity.accepted()
                    .body(new SearchStatusResponseDto(searchId, "PENDING"));
        }

        System.out.println("✅ 결과 준비 완료: count=" + result.size());
        System.out.println("========================================");
        System.out.println("결과 : :::" + result);
        return ResponseEntity.ok(result);
    }

    /* =========================================================
       ✅✅ [추가] SecurityContext에서 memberNo 꺼내는 유틸 메서드 (핵심)
       - JwtAuthenticationFilter에서 principal로 AuthUser를 넣어둔 구조에 맞춤
       - 비로그인/토큰없음/익명인증이면 null 반환
       ========================================================= */
    private Long resolveMemberNoOrNull() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // ✅ 인증정보 자체가 없으면 비로그인
        if (auth == null) return null;

        Object principal = auth.getPrincipal();

        // ✅ principal이 없거나 문자열("anonymousUser")이면 비로그인 취급
        if (principal == null) return null;
        if (principal instanceof String) return null;

        // ✅ 네 필터에서 principal로 AuthUser(memberNo, role)를 넣음
        if (principal instanceof AuthUser user) {
            // AuthUser.memberNo가 int라면 Long으로 변환해서 반환
            return (long) user.getMemberNo();
        }

        // ✅ 혹시 다른 타입으로 principal이 들어오는 케이스 대비 (안전장치)
        return null;
    }

    /* =========================================================
       ✅ 응답 DTO (컨트롤러 내부 정의)
       ========================================================= */

    public static class SearchStartResponseDto {
        private String searchId;

        public SearchStartResponseDto() {}

        public SearchStartResponseDto(String searchId) {
            this.searchId = searchId;
        }

        public String getSearchId() {
            return searchId;
        }

        public void setSearchId(String searchId) {
            this.searchId = searchId;
        }
    }

    public static class SearchStatusResponseDto {
        private String searchId;
        private String status;

        public SearchStatusResponseDto() {}

        public SearchStatusResponseDto(String searchId, String status) {
            this.searchId = searchId;
            this.status = status;
        }

        public String getSearchId() {
            return searchId;
        }

        public void setSearchId(String searchId) {
            this.searchId = searchId;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}

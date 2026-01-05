// ✅ TrendController.java
package com.kh.triptype.trend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.trend.model.dto.TrendApiResponseDto;
import com.kh.triptype.trend.model.dto.TrendPriceMoveDto;
import com.kh.triptype.trend.model.dto.TrendRouteDto;
import com.kh.triptype.trend.model.dto.TrendSurgeDto;
import com.kh.triptype.trend.service.TrendService;

@RestController
@RequestMapping("/api/trends")
public class TrendController {

    private final TrendService trendService;

    public TrendController(TrendService trendService) {
        this.trendService = trendService;
    }

    /**
     * ✅ 인기 검색 노선
     * GET /api/trends/routes?days=7&limit=3
     *
     * 응답:
     * { success:true, data:[{depart:"ICN", arrive:"KIX", count:12}, ...] }
     */
    @GetMapping("/routes")
    public ResponseEntity<TrendApiResponseDto<TrendRouteDto>> getPopularRoutes(
            @RequestParam(value = "days", required = false, defaultValue = "7") int days,
            @RequestParam(value = "limit", required = false, defaultValue = "3") int limit
    ) {
        try {
            System.out.println("========================================");
            System.out.println("🔥 [TrendController] GET /api/trends/routes");
            System.out.println("✅ params days=" + days + ", limit=" + limit);

            List<TrendRouteDto> list = trendService.getPopularRoutes(days, limit);

            System.out.println("✅ result size=" + (list == null ? "null" : list.size()));
            System.out.println("========================================");

            return ResponseEntity.ok(TrendApiResponseDto.ok(list));

        } catch (Exception e) {
            System.out.println("========================================");
            System.out.println("❌ [TrendController] 인기 노선 조회 실패");
            e.printStackTrace();
            System.out.println("========================================");

            return ResponseEntity
                    .status(500)
                    .body(TrendApiResponseDto.fail("인기 노선 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * ✅ 최근 가격 변동 노선
     * GET /api/trends/price-moves?days=7&limit=1
     *
     * 응답:
     * { success:true, data:[{depart:"ICN", arrive:"NRT", changePct:-11.2, days:7}, ...] }
     */
    @GetMapping("/price-moves")
    public ResponseEntity<TrendApiResponseDto<TrendPriceMoveDto>> getPriceMoves(
            @RequestParam(value = "days", required = false, defaultValue = "7") int days,
            @RequestParam(value = "limit", required = false, defaultValue = "1") int limit
    ) {
        try {
            System.out.println("========================================");
            System.out.println("🔥 [TrendController] GET /api/trends/price-moves");
            System.out.println("✅ params days=" + days + ", limit=" + limit);

            List<TrendPriceMoveDto> list = trendService.getPriceMoves(days, limit);

            System.out.println("✅ result size=" + (list == null ? "null" : list.size()));
            System.out.println("========================================");

            return ResponseEntity.ok(TrendApiResponseDto.ok(list));

        } catch (Exception e) {
            System.out.println("========================================");
            System.out.println("❌ [TrendController] 가격 변동 노선 조회 실패");
            e.printStackTrace();
            System.out.println("========================================");

            return ResponseEntity
                    .status(500)
                    .body(TrendApiResponseDto.fail("가격 변동 노선 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * ✅ 최근 검색 급증 노선
     * GET /api/trends/surge?days=1&limit=1
     *
     * 응답:
     * { success:true, data:[{depart:"ICN", arrive:"FUK", growthPct:42.0, days:1}, ...] }
     */
    @GetMapping("/surge")
    public ResponseEntity<TrendApiResponseDto<TrendSurgeDto>> getSurgeRoutes(
            @RequestParam(value = "days", required = false, defaultValue = "1") int days,
            @RequestParam(value = "limit", required = false, defaultValue = "1") int limit
    ) {
        try {
            System.out.println("========================================");
            System.out.println("🔥 [TrendController] GET /api/trends/surge");
            System.out.println("✅ params days=" + days + ", limit=" + limit);

            List<TrendSurgeDto> list = trendService.getSurgeRoutes(days, limit);

            System.out.println("✅ result size=" + (list == null ? "null" : list.size()));
            System.out.println("========================================");

            return ResponseEntity.ok(TrendApiResponseDto.ok(list));

        } catch (Exception e) {
            System.out.println("========================================");
            System.out.println("❌ [TrendController] 검색 급증 노선 조회 실패");
            e.printStackTrace();
            System.out.println("========================================");

            return ResponseEntity
                    .status(500)
                    .body(TrendApiResponseDto.fail("검색 급증 노선 조회 실패: " + e.getMessage()));
        }
    }
}

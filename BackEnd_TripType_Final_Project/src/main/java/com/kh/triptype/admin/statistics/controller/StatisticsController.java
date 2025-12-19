package com.kh.triptype.admin.statistics.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.admin.statistics.model.vo.PopularRouteDto;
import com.kh.triptype.admin.statistics.service.StatisticsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/popular-routes")
    public ResponseEntity<List<PopularRouteDto>> popularRoutesTop5() {
        return ResponseEntity.ok(
            statisticsService.getPopularRoutesTop5()
        );
    }
}
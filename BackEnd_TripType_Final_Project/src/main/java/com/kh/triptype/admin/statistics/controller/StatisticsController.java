package com.kh.triptype.admin.statistics.controller;

import java.util.List;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.admin.statistics.model.dto.PopularRouteDto;
import com.kh.triptype.admin.statistics.service.StatisticsService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("/admin/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/popular-routes")
    public List<PopularRouteDto> getPopularRoutesTop5() {
        List<PopularRouteDto> list = statisticsService.getPopularRoutesTop5();
        System.out.println("결과 개수: " + list.size());
        return list;
    }

};
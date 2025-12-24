package com.kh.triptype.admin.flight.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.admin.flight.service.AdminFlightService;

import lombok.RequiredArgsConstructor;
@RequiredArgsConstructor
@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("/admin/flight")
public class AdminFlightController {
	

    private final AdminFlightService adminFlightService;
    

    
    @GetMapping("/fetchflight")
    public ResponseEntity<List<Map<String, Object>>> collectTopRoutes() {

        List<Map<String, Object>> result =
                adminFlightService.collectByPopularTop5();

        
        return ResponseEntity.ok(result);
    }
}




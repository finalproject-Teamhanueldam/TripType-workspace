package com.kh.triptype.admin.flight.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.admin.flight.service.AdminFlightService;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("/admin/flight")
public class AdminFlightController {
	

    private final AdminFlightService adminFlightService;

    public AdminFlightController(AdminFlightService adminFlightService) {
        this.adminFlightService = adminFlightService;
    }

    /**
     * 항공권 조회 (테스트용)
     */
    @GetMapping("/fetchflight")
    public ResponseEntity<List<Map<String, Object>>> getFlights(
            @RequestParam String departAirport,
            @RequestParam String destAirport,
            @RequestParam String flightDepartDate,
            @RequestParam int adultCount
            
    ) {

        List<Map<String, Object>> flights =
        		adminFlightService.fetchFlightOffers(
        				departAirport,
        				destAirport,
        				flightDepartDate,
        				adultCount
                );
        
        System.out.println(flights);
        
        return ResponseEntity.ok(flights);
    }
}


package com.kh.triptype.admin.flight.controller;

import java.util.List;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.admin.flight.model.dto.FlightSelectTicketsDto;
import com.kh.triptype.admin.flight.service.AdminFlightService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("/admin/flight")
public class AdminFlightController {
	

    private final AdminFlightService adminFlightService;
    

    // api호출
    @GetMapping("/fetchflight")
    public ResponseEntity<List<Map<String, Object>>> collectRoutes() {

        List<Map<String, Object>> result =
                adminFlightService.collectFixedRoutes();

        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/selectTickets")
    public ResponseEntity<List<Object>> SelectTickets() {
    	
    	List<Object> list = adminFlightService.selectTickets();
    	
    	System.out.println(list);
    	
    	return ResponseEntity.ok(list);
    }
}




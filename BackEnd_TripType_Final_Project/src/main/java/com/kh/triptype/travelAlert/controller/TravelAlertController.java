package com.kh.triptype.travelAlert.controller;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import lombok.extern.slf4j.Slf4j;

@RestController
@CrossOrigin(origins="http://localhost:5173")
@RequestMapping("travelAlert")
@Slf4j
public class TravelAlertController {
	
	private static String KEY = "362aa0570e7649d21a2fc257f38b9b581907fb4e63b349969548efebeeac895a";
	private RestTemplate restTemplate;
	
	
	
	@GetMapping("getTravelAlert")
	public ResponseEntity<String> getTravelAlert() {
		
		

        // 요청보낼 URL 주소와 요청값
        String baseUrl  = "http://apis.data.go.kr/1262000/TravelAlarmService2/getTravelAlarmList2";
        
        // UriComponentsBuilder URL 생성 도우미 클래스
        URI uri = UriComponentsBuilder
        		.fromUriString(baseUrl)
        		.queryParam("ServiceKey", KEY)
        		.queryParam("returnType", "json")
        		.queryParam("numOfRows", 1000)
        		.queryParam("pageNo",1)
        		.build(true)
        		.toUri();
        
        // RestTemplate 외부에 요청을 보낼 수 있게 해주는 클래스
        restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(uri, String.class);
        
        // 응답이 200이면 응답 결과를 리액트로
        return ResponseEntity.ok(response);
	}
	
	
	
	@GetMapping("getTravelInfo")
	public ResponseEntity<String> getTravelInfo() {
		
		String baseUrl = "http://apis.data.go.kr/1262000/CountryHistoryService2/getCountryHistoryList2";
		
		URI uri = UriComponentsBuilder
				  .fromUriString(baseUrl)
				  .queryParam("ServiceKey", KEY)
				  .queryParam("returnType", "json")
				  .queryParam("numOfRows", 1000)
				  .queryParam("pageNo", 1)
				  .build(true)
				  .toUri();
		
		restTemplate = new RestTemplate();
		String response = restTemplate.getForObject(uri, String.class);
		
		return ResponseEntity.ok(response);
	}
	
	
	
	
}

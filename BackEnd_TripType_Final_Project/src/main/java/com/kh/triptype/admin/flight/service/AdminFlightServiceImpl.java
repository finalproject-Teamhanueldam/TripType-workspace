package com.kh.triptype.admin.flight.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class AdminFlightServiceImpl implements AdminFlightService {
	
	//properties에 저장되s amadeus.api.key 값을 주입
	@Value("${amadeus.api.key}")
	private String apiKey;
	
	@Value("${amadeus.api.secret}")
	private String apiSecret;
	
	@Value("${amadeus.oauth.url}")
	private String oauthUrl;
	
	@Value("${amadeus.flight.search.url}")
	private String flightSearchUrl;
	
	// Spring이 제공하는 다른 서버에 HTTP 요청을 보내기 위한 객체
	// 요청방식(GET/POST) + 요청 헤더 + 요청 바디 를 보내고 응답을 Java객체로 변환 시켜줌
	private final RestTemplate restTemplate = new RestTemplate();
	
	// Access Token 발급 메소드
	private String getAccessToken() {
		
		// 토큰 서버(Amadeus OAuth)는 보통 x-www-form-urlencoded 형식 바디를 요구
		// x-www-form-urlencoded : form 태그 처럼 key=value&key=value... 이런 형태를 말한다
		// body 의 데이터를 key=value 형태로 하겠다는 뜻
		// 그래서 Content_Type 을 해당 타입으로 지정
		// grant_type=client_credentials&client_id=xxx&client_secret=yyy 이런식으로 변환된다 !
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
											
		MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
		body.add("grant_type", "client_credentials");
		// grant_type : 인증 타입입니다
		// client_credentials : 서버대 서버 인증 박식으로 요청합니다
		body.add("client_id", apiKey);
		body.add("client_secret", apiSecret);
		
		// RestTemplate에 요청 보낼 때 바디 + 헤더를 함께 넘기기 위한 객체로 묶기
		//MultiValueMap  이름 그대로 하나의 키값에 여러 밸류값을 담을수 있는 객체
		HttpEntity<MultiValueMap<String, String>> request = 
				new HttpEntity<>(body, headers);
		
		// OAuth 토근 발급은 POST 요청
		ResponseEntity<Map> response = 
				// postForEntity : post 요청 
				// 첫번째 인자값 : 요청 url
				// 두번째 인자값 : 보낼 헤더와 바디
				// 세번쨰 인자값 : 응답받을 바디의 타입 지정
				restTemplate.postForEntity(oauthUrl, request, Map.class);
				// oauthUrl로 request를 보내고 응답데이터(JSON)은 Map 으로 변환해서
				// ResponseEntity타입인 response에 담아줘 라는 뜻
		
		// 응답 바디의 "access_token" 값을 꺼내서 반환
		// 이후 API 호출시 Authorizotion: Bearer {token}에 사용
		return (String) response.getBody().get("access_token");
	}
	
	// 항공권 조회
	@Override // 인터페이스에 선언된 메서드를 구현한다는 표시
	// 인터페이스에도 쓰고 구현 클래스에도 또 작성한 이유 : 
	// 인터페이스는 단순한 약속, 실행 코드가 아님
	public List<Map<String, Object>> fetchFlightOffers(
		String departAirport,
		String destAirport,
		String flightDepartDate,
		int adultCount
		
	) {
		
		// 토큰 발급
		// 위의 정의한 함수 return 값을 token 이란 문자열 변수에 담음
		String token = getAccessToken();	
		
		HttpHeaders headers = new HttpHeaders();
		headers.setBearerAuth(token);
		
		// queryParam으로 붙여 URL을 구성 
		// 문자열 더하기로 URL을 구성하면 인코딩 실수 가능성이 있음
		UriComponentsBuilder uriBuilder = UriComponentsBuilder
				.fromHttpUrl(flightSearchUrl)
				.queryParam("originLocationCode", departAirport)
				.queryParam("destinationLocationCode", destAirport)
				.queryParam("departureDate", flightDepartDate)
				.queryParam("adults", adultCount)
				.queryParam("currencyCode", "KRW")
				.queryParam("max", 100);
		
		// GET 요청은 보통 바디가 없으므로 Void
		// 만약 바디 타입이 String 이면 String Map-> Map 으로 작성 
		// 대신 헤더를 포함한 HttpEntity 를 만들어 exchange에 전달
		HttpEntity<Void> entity = new HttpEntity<>(headers);
		
		// exchange 쓰는 이유
		// getForEntity 는 URL 기반의 단순 GET을 전제로 만들어져
		// 요청단위로 헤더를 전달할 구조가 없기 때문에
		ResponseEntity<Map> response =
				restTemplate.exchange(
						uriBuilder.toUriString(),
						HttpMethod.GET,
						entity,
						Map.class
				);
		
		
		return (List<Map<String, Object>>) response.getBody().get("data");			
	        
	}
}

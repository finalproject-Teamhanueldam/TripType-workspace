package com.kh.triptype.admin.flight.service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.kh.triptype.admin.flight.dao.AdminFlightDao;
import com.kh.triptype.admin.flight.model.dto.FlightHistoryInsertDto;
import com.kh.triptype.admin.flight.model.dto.FlightInsertDto;
import com.kh.triptype.admin.flight.model.dto.FlightOfferInsertDto;
import com.kh.triptype.admin.statistics.model.dto.PopularRouteDto;
import com.kh.triptype.admin.statistics.service.StatisticsService;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class AdminFlightServiceImpl implements AdminFlightService {
	
	//properties에 저장된 amadeus.api.key 값을 주입
	@Value("${amadeus.api.key}")
	private String apiKey;
	
	@Value("${amadeus.api.secret}")
	private String apiSecret;
	
	@Value("${amadeus.oauth.url}")
	private String oauthUrl;
	
	@Value("${amadeus.flight.search.url}")
	private String flightSearchUrl;
	
	private final StatisticsService statisticsService;
	
	// Spring이 제공하는 다른 서버에 HTTP 요청을 보내기 위한 객체
	// 요청방식(GET/POST) + 요청 헤더 + 요청 바디 를 보내고 응답을 Java객체로 변환 시켜줌
	private final RestTemplate restTemplate = new RestTemplate();

	private final SqlSessionTemplate sqlSession;

	private final AdminFlightDao adminFlightDao;

	//private final AdminFlightDao adminFlightDao;
	
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
	
	
	 	@Override
	    public List<Map<String, Object>> collectByPopularTop5() {
	 		
	 		
	        // 통계 Top5 인기 노선 결과값 출력
	        List<PopularRouteDto> tooRoutes =
	                statisticsService.getPopularRoutesTop5();
	        
	        if (tooRoutes == null || tooRoutes.isEmpty()) {
	            System.out.println("탑5 인기 노선 조회 실패");
	            
	        } else {
	        	System.out.println("탑5 인기 노선 조회 성공");
	        }

	        // 토큰 발급
			// 위의 정의한 함수 return 값을 token 이란 문자열 변수에 담음
			String token = getAccessToken();	

	        // 노선별 API 호출
	        List<Map<String, Object>> result = new ArrayList<>();
	        // > 여기에 최종 top5 결과가 담겨야함
	        
	         for (PopularRouteDto route : tooRoutes) {
	        	 // PopularRouteDto route = tooRoutes.get(0);

	        
	            String departAirport = route.getDepartIata();
	            String destAirport = route.getArriveIata();
	            String flightDepartDate = LocalDate.now()
	                    .plusDays(30)
	                    .toString(); // yyyy-MM-dd
	            String flightReturnDate = LocalDate.now() 
	            		.plusDays(36)
	            		.toString();
	            
	            int adultCount = 1;
	            

	            
	            result.addAll(fetchFlightOffers(
	                    departAirport,
	                    destAirport,
	                    flightDepartDate,
	                    flightReturnDate,
	                    adultCount,
	                    token
	            ));
	            
	        };
	        
	        
	        return result;
	    };
	
	// 항공권 api 호출
	@Override // 인터페이스에 선언된 메서드를 구현한다는 표시
	// 인터페이스에도 쓰고 구현 클래스에도 또 작성한 이유 : 
	// 인터페이스는 단순한 약속, 실행 코드가 아님
	public List<Map<String, Object>> fetchFlightOffers(
		String departAirport,
		String destAirport,
		String flightDepartDate,
		String flightReturnDate,
		int adultCount,
		String token
	) {
		
		
		HttpHeaders headers = new HttpHeaders();
		headers.setBearerAuth(token);
		
		// queryParam으로 붙여 URL을 구성 
		// 문자열 더하기로 URL을 구성하면 인코딩 실수 가능성이 있음
		UriComponentsBuilder uriBuilder = UriComponentsBuilder
				.fromHttpUrl(flightSearchUrl)
				.queryParam("originLocationCode", departAirport)
				.queryParam("destinationLocationCode", destAirport)
				.queryParam("departureDate", flightDepartDate)
				.queryParam("returnDate", flightReturnDate)
				.queryParam("adults", adultCount)
				.queryParam("currencyCode", "KRW")
				.queryParam("max", 250);
		// > 요청 시 1 ~ 250번째 데이터를 조회해달라
		
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
		List<Map<String, Object>> result = (List<Map<String, Object>>) response.getBody().get("data");
		
		saveAdminFlightOffers(result);
		
		return result;			
	        
	}
	
	@Transactional
	public void saveAdminFlightOffers(List<Map<String, Object>> result) {
			
		for (Map<String, Object> offer : result) {
			
			FlightOfferInsertDto offerDto = parseFlightOffer(offer);
			
			adminFlightDao.InsertFlightOffer(sqlSession, offerDto);
			
			int offerId = offerDto.getOfferId();
			
			FlightHistoryInsertDto history = parseFlightHistory(offerDto ,offer);
			
			adminFlightDao.InsertFlightHistory(sqlSession, history);
					
			List<FlightInsertDto> flightList =
					parseFlights(offer, offerId);
			
			for (FlightInsertDto flightDto : flightList) {
				adminFlightDao.insertFlight(sqlSession, flightDto);
					
			}
		}
	}

	public FlightOfferInsertDto parseFlightOffer(Map<String, Object> offer) {
		
		Map<String, Object> price =
				(Map<String, Object>) offer.get("price");
		
		FlightOfferInsertDto dto = new FlightOfferInsertDto();
		
		dto.setPriceTotal(
				new BigDecimal(price.get("total").toString())
				);
		
		dto.setExtraSeat(
				offer.get("numberOfBookableSeats") == null ? null : Integer.parseInt(offer.get("numberOfBookableSeats").toString())
						
				);
	dto.setApiQueryDate(LocalDateTime.now());
	dto.setIsDel("N");
	
	// 출발 / 귀국일
	
	List<Map<String,Object>> itineraries = 
			(List<Map<String,Object>>) offer.get("itineraries");
	
	Map<String, Object> firstSeg = 
			(Map<String,Object>)((List<Map<String, Object>>) itineraries.get(0).get("segments")).get(0);
	
	dto.setDepartDate(
			LocalDateTime.parse(
					((Map<String, Object>) firstSeg.get("departure")).get("at").toString()
					)
			);
	
	if (itineraries.size() > 1) {
		Map<String, Object> returnSeg =
				(Map<String, Object>) ((List<Map<String, Object>>) itineraries.get(1).get("segments")).get(0);
		
		dto.setReturnDate(
				LocalDateTime.parse(((Map<String, Object>) returnSeg.get("departure")).get("at").toString()
						)
					);
				
			}
	
	// 가는편/오는편 총 소요시간 (int 타입)
	

	
	dto.setDepartDurationTotal(itineraries.get(0).get("duration").toString());
	
	dto.setReturnDurationTotal(itineraries.get(1).get("duration").toString());
	
	 dto.setAirlineId(1);

     return dto;
     
	}
	
	// Flight 테이블
	 public List<FlightInsertDto> parseFlights(
		        Map<String, Object> offer,
		        int offerId
		    ) {

		        List<FlightInsertDto> list = new ArrayList<>();

		        List<Map<String, Object>> itineraries =
		            (List<Map<String, Object>>) offer.get("itineraries");

		        for (int i = 0; i < itineraries.size(); i++) {

		            String direction = (i == 0) ? "D" : "R";

		            List<Map<String, Object>> segments =
		                (List<Map<String, Object>>) itineraries.get(i).get("segments");

		            int segmentNo = 1;

		            for (Map<String, Object> seg : segments) {

		                FlightInsertDto dto = new FlightInsertDto();

		                dto.setOfferId(offerId);
		                dto.setDirection(direction);
		                dto.setSegmentNo(segmentNo++);

		                dto.setDepartAirport(
		                    ((Map<String, Object>) seg.get("departure"))
		                        .get("iataCode").toString()
		                );
		                dto.setDestAirport(
		                    ((Map<String, Object>) seg.get("arrival"))
		                        .get("iataCode").toString()
		                );

		                dto.setDepartDateTime(
		                    LocalDateTime.parse(
		                        ((Map<String, Object>) seg.get("departure"))
		                            .get("at").toString()
		                    )
		                );

		                dto.setArriveDateTime(
		                    LocalDateTime.parse(
		                        ((Map<String, Object>) seg.get("arrival"))
		                            .get("at").toString()
		                    )
		                );

		                dto.setOfferAirlineId(seg.get("carrierCode").toString());
		                
		                List<String> validatingAirlines =
		                	    (List<String>) offer.get("validatingAirlineCodes");

		                	dto.setSellAirlineId(validatingAirlines.get(0));
		                dto.setFligtNo(seg.get("number").toString());

		                list.add(dto);
		            }
		        }

		        return list;
		    }
	 
	 // history 테이블
	 public FlightHistoryInsertDto parseFlightHistory(
		        FlightOfferInsertDto offerDto,
		        Map<String, Object> offer
		) {
		    FlightHistoryInsertDto history = new FlightHistoryInsertDto();

		    history.setOfferId(offerDto.getOfferId());
		    Map<String, Object> price =
		    	    (Map<String, Object>) offer.get("price");

		    	String totalStr = price.get("total").toString();
		    	
		    	BigDecimal totalPrice = new BigDecimal(totalStr);
		    	
		    	history.setPriceTotal(totalPrice);
		    	
		    history.setCurrency(price.get("currency").toString());
		    history.setOneWay("N");

		    history.setDepartDate(offerDto.getDepartDate());
		    history.setReturnDate(offerDto.getReturnDate());

		    history.setApiQueryDate(LocalDateTime.now());
		    
		    // api 호출 값에서 출발 공항 코드 추출
		    List<Map<String, Object>> itineraries =
		    	    (List<Map<String, Object>>) offer.get("itineraries");

		    	Map<String, Object> firstItinerary = itineraries.get(0);

		    	List<Map<String, Object>> segments =
		    	    (List<Map<String, Object>>) firstItinerary.get("segments");

		    	Map<String, Object> firstSegment = segments.get(0);

		    	Map<String, Object> departure =
		    	    (Map<String, Object>) firstSegment.get("departure");

		    	String departIata = departure.get("iataCode").toString();
		    
	    	// api 호출 값에서 도착 공항 코드 추출
	    	Map<String, Object> lastSegment =
	    		    segments.get(segments.size() - 1);

	    		Map<String, Object> arrival =
	    		    (Map<String, Object>) lastSegment.get("arrival");

	    		String arriveIata = arrival.get("iataCode").toString();

		    history.setDepartAirport(departIata);
		    history.setArriveAirport(arriveIata);

		    history.setAirlineId(offerDto.getAirlineId());

		    return history;
		}
	 
	


}

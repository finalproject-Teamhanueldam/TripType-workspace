package com.kh.triptype.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;



/*
 * * 인터셉터를 가져다 쓰려면
 * - 마찬가지로 인터셉터 클래스를 빈으로 등록해줘야 한다!!
 * - 인터셉터 형식의 클래스를 빈으로 등록하려면 반드시 WebMvcConfigurer 라는 인터페이스를 상속받아서 구현해야함
 * 
 */

@Configuration
public class InterceptorConfig implements WebMvcConfigurer {
	
//	@Autowired
//	private LoginInterceptor loginInterceptor;

	// 인터셉터를 빈으로 등록하는 과정에서
	// 어느 요청이 어느 인터셉터를 거쳐갈지 등록하는 부분
	@Override
	public void addInterceptors(InterceptorRegistry registry) {

		// * 매개변수
		// - registry : 인터셉터들의 정보를 보관하는 객체
		//				내가 필요로 하는 인터셉터 정보들을 차곡차곡 담기
		// > 인터셉터의 종류와 가로챌 요청의 url 주소를 같이 기술한다!!
		
//		registry.addInterceptor(loginInterceptor)
//				.addPathPatterns("/myPage")
//				.addPathPatterns("/notice/write")
//				.addPathPatterns("/notice/edit")
//				.addPathPatterns("/info/enrollForm")
//				.addPathPatterns("/info/updateForm")
//				.addPathPatterns("/knowledge/enrollForm")
//				.addPathPatterns("/knowledge/updateForm")
//				.addPathPatterns("/study/enrollForm")
//				.addPathPatterns("/study/updateForm")
//				.addPathPatterns("/free/enrollForm")
//				.addPathPatterns("/free/updateForm")
//				.addPathPatterns("/admin");
		
		
		// ...
		// > 지금부터 loginInterceptor 를 쓸건데
		//   loginInterceptor 는 위에서 제시한 PathPattern 쪽으로 요청 시에만 거쳐가게끔 해주겠다.
		
		// 만약 admin 계정에 대한 권한 체크도 하고싶다면
		// > com.kh.spring.common.interceptor 패키지에 AdminCheckInterceptor 클래스를 구현 후
		//   여기서 registry.addInterceptor(AdminCheckInterceptor객체).addPathPatterns(~~)...
		//   로 한번 더 등록하면 된다!!
		
	}

}

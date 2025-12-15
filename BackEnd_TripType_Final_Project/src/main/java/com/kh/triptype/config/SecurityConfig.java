package com.kh.triptype.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/*
 * * Bean
 * - 스프링에서 쓰이는 자바 객체를 Bean 이라고 부른다.
 * - 클래스 별로 Bean 으로 등록하면, 내가 필요할 때 마다 (@Autowired) 알아서
 *   스프링이 그 객체를 생성해서 쓰라고 나한테 주입해줌!! (DI, 의존성 주입 특징)
 * - 내가 그 객체를 다 쓰고 나면 스프링이 알아서 객체를 반납 (소멸) 까지 해줌!!
 * - 이 모든 일련의 과정들은 스프링이 주도하여 코드에 개입함!! (IoC, 제어의 역전 특징)
 * 
 * * 스프링에서 빈 등록 방법
 * - 스프링으로 부터 만들어진 객체를 받아서 쓰고 싶다면 무조건 빈으로 등록해야함!!
 * 1. 클래스 선언부 상단에 @Component (@Controller, @Service, @Repository)
 *    어노테이션을 작성하여 빈으로 등록하는 방법
 *    > 가장 간단한 방법 - 내가 직접 작성한 자바 클래스에 적용 가능한 방법
 * 2. xml 파일 형식으로 빈으로 등록하는 방법
 *    > 길고 복잡한 방법 - Spring Boot 에서는 잘 안쓰임!! (Spring Legacy 방식)
 * 3. 자바 코드 형식으로 빈으로 등록하는 방법
 *    > 다소 복잡한 방법 
 *    - 2, 3 번은 남들이 만들어준 자바 클래스 (코드를 수정 못하는) 에 적용하는 방법
 *    
 * 참고로, SqlSessionTemplate 은 스프링 부트에 의해 자동으로 빈으로 등록되었기 때문에
 * 어제 별도의 빈 등록 과정을 거치지 않고 바로 @Autowired 로 가져다 쓴 것!!
 */

@Configuration
// > 이 클래스는 빈 등록용 클래스임을 알려주는 어노테이션
public class SecurityConfig {
	
	// 스프링 시큐리티 모듈에서 제공하는 BCryptPasswordEncoder 클래스를 빈으로 등록
	// > 자바의 메소드 형식으로 등록한다.
	//   반환형에 빈으로 등록할 클래스명, 메소드명은 앞자만 소문자로 따서 적는다!!
	@Bean
	// > 이 메소드는 빈 등록용 메소드임을 알려주는 어노테이션
	public BCryptPasswordEncoder bCryptPasswordEncoder() {

		return new BCryptPasswordEncoder();
	}
	// > 이런 식으로 메소드로 빈을 등록하게 되면
	//   이 메소드를 스프링이 호출해서 객체를 생성해 두고,
	//   해당 객체가 필요할 때 마다 나에게 던져주는 동작 원리임!!

}

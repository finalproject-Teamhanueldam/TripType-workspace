package com.kh.spring.common.template;

// XSS 공격 방지를 위한 공통 코드 작업 진행
public class XssDefencePolicy {
	
	public static String defence(String originText) {
		
		// 원본 문자열을 매개변수로 받아 모두 치환한 후 그 결과 문자열을 리턴
		
		String changeText = originText;
		
		changeText = changeText.replace("<", "&lt;");
		changeText = changeText.replace(">", "&gt;");
		changeText = changeText.replace("\"", "&quot;");
		changeText = changeText.replace("'", "&apos;");
		// ...
		// 그 외의 예약어도 더 막을 수 있음!!

		return changeText;
	}

}

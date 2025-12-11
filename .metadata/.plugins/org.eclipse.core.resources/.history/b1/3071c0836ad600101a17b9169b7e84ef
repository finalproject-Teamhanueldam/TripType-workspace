package com.kh.spring.common.template;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpSession;

// 파일명 수정 후 서버로 업로드 하는 공통 코드 작업
public class FileRenamePolicy {
	
	public static String saveFile(MultipartFile upfile, HttpSession session, String path) {
		
		// 예) "bono.jpg" --> "2025102015023012345.jpg"
		//    년월일시분초 + 5자리랜덤수 + 원래확장자명
		//    (최대한 파일명이 중복되지 않게)
		
		// 1. 원본파일명 뽑아오기
		String originName = upfile.getOriginalFilename();
		// "bono.jpg"
		
		// 2. 현재 시간을 형식에 맞게 문자열로 뽑기
		String currentTime = new SimpleDateFormat("yyyyMMddHHmmss")
								.format(new Date()); 
		// "20251020150230" (년월일시분초)
		
		// 3. 뒤에 붙을 5자리 랜덤값 뽑기 (10000 ~ 99999)
		int ranNum = (int)(Math.random() * 90000 + 10000);
		// 12345
		
		// 4. 원본파일명으로부터 확장자명만 뽑아오기
		String ext = originName.substring(originName.lastIndexOf("."));
		// ".jpg"
		
		// 5. 모두 이어 붙이기
		String changeName = currentTime + ranNum + ext;
		
		// 6. 업로드 하고자 하는 폴더의 경로 셋팅하기
		// > 단, 우리는 지금 개발 단계이지만 추후 배포 단계를 고려해서 경로를 셋팅!!
		//   우리의 배포 폴더 역할을 하는 webapp 폴더 기준으로 경로를 잡아 줄 것!!
		//   webapp 폴더 내부의 resources 폴더 (외부 자원 파일을 담는 폴더)
		//   내부 어딘가에 첨부파일들을 보관할 수 있게끔 유도해보자
		//   (webapp/resources/board_upfiles 폴더)
		
		// application 객체에서 제공하는 getRealPath 메소드를 통해 알아내기
		// request 객체로부터, session 객체로부터 얻어내는 방법이 있음!!
		String savePath = session.getServletContext()
								 .getRealPath(path);
		// > 앞의 / 는 webapp 폴더를 나타내고,
		//   뒤의 / 는 이 board_upfiles 라는 폴더의 내부를 뜻함!!
		//   업로드된 파일들은 항상 "폴더 안에" 저장되야 하므로!!
		// > savePath 에는 C 드라이브 (루트 디렉토리) 에서 부터 시작되는
		//   board_upfiles 라는 폴더의 절대 경로가 담겨있을 것!!
		
		// 7. 파일 경로와 수정파일명을 합체 후 파일을 업로드 해주기
		try {
			upfile.transferTo(new File(savePath + changeName));
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return changeName;
		
	}

}

package com.kh.triptype.notice.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.notice.model.vo.Notice;
import com.kh.triptype.notice.service.NoticeService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/notice")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping
    public Map<String, Object> noticeList(
            @RequestParam(defaultValue = "1") int page
    ) {
        return noticeService.getNoticeList(page);
    }

    @GetMapping("/{noticeId}")
    public Notice noticeDetail(@PathVariable Long noticeId) {
        return noticeService.getNoticeDetail(noticeId);
    }
    
    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> download(@PathVariable String fileName) throws Exception {

        Path filePath = Paths.get("C:/upload/notice").resolve(fileName);
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" +
                URLEncoder.encode(fileName, StandardCharsets.UTF_8) + "\"")
            .body(resource);
    }
    
}

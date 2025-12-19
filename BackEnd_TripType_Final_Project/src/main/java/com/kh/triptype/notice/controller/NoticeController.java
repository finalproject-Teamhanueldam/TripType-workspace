package com.kh.triptype.notice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

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
    public List<Notice> noticeList() {
        return noticeService.getNoticeList();
    }

    @GetMapping("/{noticeId}")
    public Notice noticeDetail(@PathVariable Long noticeId) {
        return noticeService.getNoticeDetail(noticeId);
    }
}

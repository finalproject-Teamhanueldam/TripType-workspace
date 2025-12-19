package com.kh.triptype.notice.controller;

import org.springframework.web.bind.annotation.*;

import com.kh.triptype.notice.model.vo.Notice;
import com.kh.triptype.notice.service.NoticeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/notices")
@RequiredArgsConstructor
public class AdminNoticeController {

    private final NoticeService noticeService;

    @PostMapping
    public void createNotice(@RequestBody Notice notice) {
        noticeService.createNotice(notice);
    }

    @PutMapping("/{noticeId}")
    public void updateNotice(@PathVariable Long noticeId,
                             @RequestBody Notice notice) {
        notice.setNoticeId(noticeId);
        noticeService.updateNotice(notice);
    }

    @DeleteMapping("/{noticeId}")
    public void deleteNotice(@PathVariable Long noticeId) {
        noticeService.deleteNotice(noticeId);
    }
}

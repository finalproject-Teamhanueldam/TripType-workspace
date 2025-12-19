package com.kh.triptype.notice.comment.controller;

import org.springframework.web.bind.annotation.*;

import com.kh.triptype.notice.comment.service.NoticeCommentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/notice-comments")
@RequiredArgsConstructor
public class AdminNoticeCommentController {

    private final NoticeCommentService commentService;

    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
    }
}

package com.kh.triptype.notice.comment.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.kh.triptype.notice.comment.model.vo.NoticeComment;
import com.kh.triptype.notice.comment.service.NoticeCommentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notices/{noticeId}/comments")
@RequiredArgsConstructor
public class NoticeCommentController {

    private final NoticeCommentService commentService;

    @GetMapping
    public List<NoticeComment> commentList(@PathVariable Long noticeId) {
        return commentService.getCommentList(noticeId);
    }

    @PostMapping
    public void createComment(@PathVariable Long noticeId,
                              @RequestBody NoticeComment comment) {
        comment.setNoticeId(noticeId);
        commentService.createComment(comment);
    }
}

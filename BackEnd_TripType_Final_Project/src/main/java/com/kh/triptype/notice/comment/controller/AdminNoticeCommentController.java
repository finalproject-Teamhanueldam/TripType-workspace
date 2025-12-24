package com.kh.triptype.notice.comment.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.kh.triptype.notice.comment.model.vo.NoticeComment;
import com.kh.triptype.notice.comment.service.NoticeCommentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/notice/{noticeId}/comment")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminNoticeCommentController {

    private final NoticeCommentService commentService;

    /** 특정 공지 댓글 목록 조회 */
    @GetMapping
    public List<NoticeComment> getCommentList(@PathVariable Long noticeId) {
        return commentService.getCommentList(noticeId);
    }

    /** 단일 댓글 삭제 */
    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable Long noticeId,
                              @PathVariable Long commentId) {
    	commentService.deleteComment(noticeId, commentId);
    }
}

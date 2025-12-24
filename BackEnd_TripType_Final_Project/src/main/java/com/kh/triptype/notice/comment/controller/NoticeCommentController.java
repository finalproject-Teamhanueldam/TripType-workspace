package com.kh.triptype.notice.comment.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.notice.comment.model.vo.NoticeComment;
import com.kh.triptype.notice.comment.service.NoticeCommentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notice/{noticeId}/comment")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
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

    // 댓글 수정
    @PutMapping("/{commentId}")
    public void updateComment(@PathVariable Long noticeId,
                              @PathVariable Long commentId,
                              @RequestBody NoticeComment comment) {
        comment.setNoticeId(noticeId);
        comment.setNoticeCommentId(commentId);
        commentService.updateComment(comment);
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable Long noticeId,
                              @PathVariable Long commentId,
                              @RequestParam Long memberNo) {
        commentService.deleteComment(commentId, memberNo); // memberNo까지 전달
    }


}

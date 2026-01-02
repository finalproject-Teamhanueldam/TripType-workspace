package com.kh.triptype.notice.comment.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
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

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notice/{noticeId}/comment")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class NoticeCommentController {

    private final NoticeCommentService commentService;

    // 댓글 목록 조회 (페이징)
    @GetMapping
    public Map<String, Object> commentList(
            @PathVariable Long noticeId,
            @RequestParam int startRow,
            @RequestParam int endRow,
            jakarta.servlet.http.HttpServletRequest request   // ⭐ 추가
    ) {
    	
        Map<String, Object> result = new HashMap<>();

        List<NoticeComment> comments =
                commentService.getCommentList(noticeId, startRow, endRow, request);
        int totalCount =
                commentService.getCommentCount(noticeId);

        result.put("comments", comments);
        result.put("totalCount", totalCount);

        return result;
    }


 // 댓글 등록
    @PostMapping
    public ResponseEntity<?> createComment(
            @PathVariable Long noticeId,
            @RequestBody NoticeComment comment,
            jakarta.servlet.http.HttpServletRequest request
    ) {
        Long memberNo = (Long) request.getAttribute("memberNo");

        comment.setNoticeId(noticeId);
        commentService.createComment(comment, memberNo);

        return ResponseEntity.ok().build();
    }

    // 댓글 수정
    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long noticeId,
            @PathVariable Long commentId,
            @RequestBody NoticeComment comment,
            jakarta.servlet.http.HttpServletRequest request
    ) {
        Long memberNo = (Long) request.getAttribute("memberNo");

        comment.setNoticeId(noticeId);
        comment.setNoticeCommentId(commentId);

        commentService.updateComment(comment, memberNo);
        return ResponseEntity.ok().build();
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
        @PathVariable Long commentId,
        HttpServletRequest request
    ) {
        Long memberNo = (Long) request.getAttribute("memberNo");
        commentService.deleteCommentByUser(commentId, memberNo);
        return ResponseEntity.ok().build();
    }
}



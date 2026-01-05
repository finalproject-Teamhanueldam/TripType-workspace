package com.kh.triptype.notice.comment.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.triptype.notice.comment.model.vo.NoticeComment;
import com.kh.triptype.notice.comment.service.NoticeCommentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/notice/{noticeId}/comment")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminNoticeCommentController {

    private final NoticeCommentService commentService;

    // 관리자 댓글 목록 조회 (페이징 + 삭제여부 토글)
    @GetMapping
    public Map<String, Object> getCommentList(
            @PathVariable Long noticeId,
            @RequestParam int startRow,
            @RequestParam int endRow,
            @RequestParam(required = false, defaultValue = "N") String showDeleted
    ) {
        List<NoticeComment> comments =
                commentService.getCommentListAdmin(noticeId, startRow, endRow, showDeleted);

        int totalCount =
                commentService.getCommentCountAdmin(noticeId, showDeleted);

        Map<String, Object> result = new HashMap<>();
        result.put("comments", comments);
        result.put("totalCount", totalCount);

        return result;
    }


    // 관리자 댓글 삭제
    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable Long commentId) {
        commentService.deleteCommentByAdmin(commentId);
    }
}

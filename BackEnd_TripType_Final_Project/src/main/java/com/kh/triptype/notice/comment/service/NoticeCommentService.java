package com.kh.triptype.notice.comment.service;

import java.util.List;

import com.kh.triptype.notice.comment.model.vo.NoticeComment;

public interface NoticeCommentService {

    // 사용자 댓글 조회 (페이징)
    List<NoticeComment> getCommentList(Long noticeId, int startRow, int endRow, jakarta.servlet.http.HttpServletRequest request);

    // 관리자 댓글 조회 (페이징 + 삭제여부 토글)
    List<NoticeComment> getCommentListAdmin(Long noticeId, int startRow, int endRow, String showDeleted);

    // 총 댓글 수
    int getCommentCount(Long noticeId);
    int getCommentCountAdmin(Long noticeId, String showDeleted);

    // jwt
    int createComment(NoticeComment comment, Long memberNo);
    int updateComment(NoticeComment comment, Long memberNo);
    int deleteCommentByUser(Long commentId, Long memberNo);
    
    int deleteCommentByAdmin(Long commentId);
}

package com.kh.triptype.notice.comment.service;

import java.util.List;
import com.kh.triptype.notice.comment.model.vo.NoticeComment;

public interface NoticeCommentService {

    /** 댓글 목록 */
    List<NoticeComment> getCommentList(Long noticeId);

    /** 댓글 등록 */
    int createComment(NoticeComment comment);

    /** 댓글 수정 */
    int updateComment(NoticeComment comment);

    /** 댓글 삭제 
     * @param memberNo */
    int deleteComment(Long noticeCommentId, Long memberNo);
}

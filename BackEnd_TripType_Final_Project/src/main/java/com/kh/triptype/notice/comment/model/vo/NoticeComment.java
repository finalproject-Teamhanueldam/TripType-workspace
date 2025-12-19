package com.kh.triptype.notice.comment.model.vo;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoticeComment {

    private Long noticeCommentId;              // NOTICE_COMMENT_ID
    private String noticeCommentContent;       // NOTICE_COMMENT_CONTENT

    private LocalDateTime noticeCommentCreatedAt; // CREATED_AT
    private LocalDateTime noticeCommentUpdatedAt; // UPDATED_AT

    private String noticeCommentIsDel;         // IS_DEL
    private Long noticeId;                     // NOTICE_ID
    private Long memberNo;                     // MEMBER_NO
}

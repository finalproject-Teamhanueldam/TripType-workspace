package com.kh.triptype.notice.model.vo;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attachment {

    private Long noticeAttachmentId;            // NOTICE_ATTACHMENT_ID
    private String noticeAttachmentName;        // NOTICE_ATTACHMENT_NAME
    private String noticeAttachmentUpdate;      // NOTICE_ATTACHMENT_UPDATE
    private String noticeAttachmentUrl;         // NOTICE_ATTACHMENT_URL
    private LocalDateTime noticeAttachmentUploadedAt; // NOTICE_ATTACHMENT_UPLOADED_AT
    private String noticeAttachmentIsDel;       // NOTICE_ATTACHMENT_IS_DEL
    private Long noticeId;                      // NOTICE_ID
}

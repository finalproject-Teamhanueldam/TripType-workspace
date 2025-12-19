package com.kh.triptype.notice.model.vo;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notice {

    private Long noticeId;                // NOTICE_ID
    private String noticeTitle;            // NOTICE_TITLE
    private String noticeContent;          // NOTICE_CONTENT

    private LocalDateTime noticeCreatedAt; // NOTICE_CREATED_AT
    private LocalDateTime noticeUpdatedAt; // NOTICE_UPDATED_AT
    private int noticeViews;               // NOTICE_VIEWS

    private String noticeIsImportant;      // NOTICE_IS_IMPORTANT (Y/N)
    private String noticeIsDel;             // NOTICE_IS_DEL (Y/N)

}

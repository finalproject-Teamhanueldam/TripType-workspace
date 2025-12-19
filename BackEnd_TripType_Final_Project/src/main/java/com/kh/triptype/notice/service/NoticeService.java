package com.kh.triptype.notice.service;

import java.util.List;
import com.kh.triptype.notice.model.vo.Notice;

public interface NoticeService {

    /** 사용자 : 공지 목록 */
    List<Notice> getNoticeList();

    /** 사용자 : 공지 상세 + 조회수 증가 */
    Notice getNoticeDetail(Long noticeId);

    /** 관리자 : 공지 등록 */
    int createNotice(Notice notice);

    /** 관리자 : 공지 수정 */
    int updateNotice(Notice notice);

    /** 관리자 : 공지 삭제 */
    int deleteNotice(Long noticeId);
}

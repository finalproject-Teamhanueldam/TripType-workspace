package com.kh.triptype.notice.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.kh.triptype.notice.model.vo.Notice;

public interface NoticeService {

    /* ================= 사용자 ================= */

    /** 공지 목록 (사용자용, 삭제 제외, 페이징) */
    Map<String, Object> getNoticeList(int currentPage);

    /** 공지 상세 (조회수 증가) */
    Notice getNoticeDetail(Long noticeId);


    /* ================= 관리자 ================= */

    /** 공지 목록 (관리자용, 삭제 포함 토글, 페이징) */
    Map<String, Object> getNoticeListAdmin(
        int currentPage,
        String showDeleted
    );

    /** 공지 상세 (관리자용, 삭제 포함) */
    Notice getNoticeDetailAdmin(Long noticeId);

    /** 공지 등록 + 첨부파일 */
    int createNotice(
        Notice notice,
        List<MultipartFile> files
    );

    /** 공지 수정 + 첨부파일 관리 */
    int updateNoticeWithFiles(
        Notice notice,
        List<MultipartFile> newFiles,
        List<Long> deletedFileIds
    );

    /** 공지 논리삭제 (첨부 포함) */
    int deleteNotice(Long noticeId);
}

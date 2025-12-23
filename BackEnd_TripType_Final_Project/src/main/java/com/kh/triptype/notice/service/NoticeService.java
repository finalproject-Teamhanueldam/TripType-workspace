package com.kh.triptype.notice.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.kh.triptype.notice.model.vo.Notice;

public interface NoticeService {
    List<Notice> getNoticeList();
    Notice getNoticeDetail(Long noticeId);
    int createNotice(Notice notice, List<MultipartFile> files);
    int updateNoticeWithFiles(Notice notice, List<MultipartFile> newFiles, List<Long> deletedFileIds);
    int deleteNotice(Long noticeId);
	List<Notice> getNoticeListAdmin();
}

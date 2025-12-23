package com.kh.triptype.notice.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.io.File;
import java.util.UUID;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.kh.triptype.notice.dao.NoticeDao;
import com.kh.triptype.notice.model.vo.Attachment;
import com.kh.triptype.notice.model.vo.Notice;

@Service
public class NoticeServiceImpl implements NoticeService {

    private final NoticeDao noticeDao;
    private final SqlSessionTemplate sqlSession;

    public NoticeServiceImpl(NoticeDao noticeDao, SqlSessionTemplate sqlSession) {
        this.noticeDao = noticeDao;
        this.sqlSession = sqlSession;
    }

    @Override
    public List<Notice> getNoticeList() {
        return noticeDao.selectNoticeList(sqlSession);
    }

    @Override
    @Transactional
    public Notice getNoticeDetail(Long noticeId) {

        Map<String, Object> param = new HashMap<>();
        param.put("noticeId", noticeId);

        noticeDao.increaseViews(sqlSession, param);

     // 🔥 첨부파일 자동 포함
        return noticeDao.selectNoticeDetail(sqlSession, param);
    }



    @Override
    @Transactional
    public int createNotice(Notice notice, List<MultipartFile> files) {

        // 1️⃣ 공지 등록 (noticeId 세팅됨)
        int result = noticeDao.insertNotice(sqlSession, notice);

        if (files == null || files.isEmpty()) {
            return result;
        }

        String uploadDir = "C:/upload/notice/";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            String originName = file.getOriginalFilename();
            String savedName = UUID.randomUUID() + "_" + originName;

            try {
                file.transferTo(new File(uploadDir + savedName));
            } catch (Exception e) {
                throw new RuntimeException("파일 저장 실패", e); // 🔥 전체 롤백
            }

            Attachment at = new Attachment();
            at.setNoticeId(notice.getNoticeId()); // 🔥 핵심
            at.setNoticeAttachmentName(originName);
            at.setNoticeAttachmentUpdate(savedName);
            at.setNoticeAttachmentUrl("/upload/notice/" + savedName);

            noticeDao.insertAttachment(sqlSession, at);
        }

        return result;
    }

    


    /** 공지 수정 + 첨부파일 처리 */
    @Override
    @Transactional
    public int updateNoticeWithFiles(Notice notice, List<MultipartFile> newFiles, List<Long> deletedFileIds) {
        // 1. 기존 첨부파일 삭제
        if (deletedFileIds != null && !deletedFileIds.isEmpty()) {
            Map<String, Object> delMap = new HashMap<>();
            delMap.put("deletedFileIds", deletedFileIds);
            noticeDao.deleteAttachment(sqlSession, delMap);
        }

        // 2. 공지사항 내용 수정
        int result = noticeDao.updateNotice(sqlSession, notice);

        // 3. 신규 첨부파일 추가
        if (newFiles != null && !newFiles.isEmpty()) {
            for (MultipartFile file : newFiles) {
                if (file.isEmpty()) continue;
                Attachment at = new Attachment();
                at.setNoticeId(notice.getNoticeId());
                at.setNoticeAttachmentName(file.getOriginalFilename());
                at.setNoticeAttachmentUpdate(file.getOriginalFilename());
                at.setNoticeAttachmentUrl("/upload/notice/" + file.getOriginalFilename());
                noticeDao.insertAttachment(sqlSession, at);
            }
        }

        return result;
    }

    
    @Transactional
    public List<Notice> getNoticeListAdmin() {
        return noticeDao.selectNoticeListAdmin(sqlSession);
    }

    
    @Transactional
    public Notice getNoticeDetailAdmin(Long noticeId) {

        Notice notice = noticeDao.selectNoticeDetail(
            sqlSession,
            Map.of("noticeId", noticeId)
        );

        if (notice != null) {
            List<Attachment> attachments =
                noticeDao.selectAttachmentListAdmin(sqlSession, noticeId);
            notice.setAttachmentList(attachments);
        }

        return notice;
    }

    
    @Override
    @Transactional
    public int deleteNotice(Long noticeId) {
        noticeDao.deleteAttachmentByNotice(sqlSession, noticeId); // 첨부 논리삭제
        return noticeDao.deleteNotice(sqlSession, noticeId);      // 공지 논리삭제
    }


}

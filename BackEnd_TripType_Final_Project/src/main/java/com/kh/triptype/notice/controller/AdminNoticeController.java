package com.kh.triptype.notice.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.triptype.notice.model.vo.Notice;
import com.kh.triptype.notice.service.NoticeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/notice")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminNoticeController {

    private final NoticeService noticeService;

    
    /** 관리자 공지 목록 */
  
    @GetMapping
    public Map<String, Object> getAdminNotice(
    	    @RequestParam(defaultValue = "1") int page,
    	    @RequestParam(defaultValue = "N") String showDeleted
    	) {
    	    return noticeService.getNoticeListAdmin(page, showDeleted);
    	}

    
    /** 공지 상세 조회 */
    @GetMapping("/{noticeId}")
    public Notice getNoticeDetail(@PathVariable Long noticeId) {
        return noticeService.getNoticeDetailAdmin(noticeId);
    }


    /** 공지 수정 (첨부파일 포함) */
    @PutMapping(value = "/{noticeId}", consumes = "multipart/form-data")
    public int updateNotice(
            @PathVariable Long noticeId,
            @RequestPart("notice") String noticeJson,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestPart(value = "deletedFileIds", required = false) String deletedFileIdsJson
    ) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        Notice notice = mapper.readValue(noticeJson, Notice.class);
        notice.setNoticeId(noticeId);

        // deletedFileIds 처리
        List<Long> deletedFileIds = deletedFileIdsJson != null ?
                mapper.readValue(deletedFileIdsJson, new TypeReference<List<Long>>() {}) : null;

        return noticeService.updateNoticeWithFiles(notice, files, deletedFileIds);
    }

    /** 공지 삭제 */
    @DeleteMapping("/{noticeId}")
    public int deleteNotice(@PathVariable Long noticeId) {
        return noticeService.deleteNotice(noticeId);
    }

    /** 관리자 공지 등록 (첨부파일 포함) */
    @PostMapping(consumes = "multipart/form-data")
    public int createNotice(
        @RequestPart("notice") String noticeJson,
        @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        Notice notice = mapper.readValue(noticeJson, Notice.class);
        return noticeService.createNotice(notice, files);
    }



}

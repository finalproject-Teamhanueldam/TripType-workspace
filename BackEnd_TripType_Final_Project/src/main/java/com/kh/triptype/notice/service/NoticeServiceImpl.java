package com.kh.triptype.notice.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.triptype.notice.dao.NoticeDao;
import com.kh.triptype.notice.model.vo.Notice;

@Service
public class NoticeServiceImpl implements NoticeService {

    private final NoticeDao noticeDao;
    private final SqlSessionTemplate sqlSession;

    public NoticeServiceImpl(NoticeDao noticeDao, SqlSessionTemplate sqlSession) {
        this.noticeDao = noticeDao;
        this.sqlSession = sqlSession;
    }

    /** 사용자 : 공지 목록 */
    @Override
    public List<Notice> getNoticeList() {
        return noticeDao.selectNoticeList(sqlSession);
    }

    /** 사용자 : 공지 상세 + 조회수 증가 */
    @Override
    @Transactional
    public Notice getNoticeDetail(Long noticeId) {

        Map<String, Object> param = new HashMap<>();
        param.put("noticeId", noticeId);

        noticeDao.increaseViews(sqlSession, param);
        return noticeDao.selectNoticeDetail(sqlSession, param);
    }

    /** 관리자 : 공지 등록 */
    @Override
    @Transactional
    public int createNotice(Notice notice) {
        return noticeDao.insertNotice(sqlSession, notice);
    }

    /** 관리자 : 공지 수정 */
    @Override
    @Transactional
    public int updateNotice(Notice notice) {
        return noticeDao.updateNotice(sqlSession, notice);
    }

    /** 관리자 : 공지 삭제 */
    @Override
    @Transactional
    public int deleteNotice(Long noticeId) {
        Map<String, Object> param = new HashMap<>();
        param.put("noticeId", noticeId);

        return noticeDao.deleteNotice(sqlSession, param);
    }
}

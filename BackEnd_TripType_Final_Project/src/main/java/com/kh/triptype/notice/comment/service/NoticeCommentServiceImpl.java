package com.kh.triptype.notice.comment.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.triptype.notice.comment.dao.NoticeCommentDao;
import com.kh.triptype.notice.comment.model.vo.NoticeComment;

@Service
public class NoticeCommentServiceImpl implements NoticeCommentService {

    private final NoticeCommentDao noticeCommentDao;
    private final SqlSessionTemplate sqlSession;

    public NoticeCommentServiceImpl(NoticeCommentDao noticeCommentDao, SqlSessionTemplate sqlSession) {
        this.noticeCommentDao = noticeCommentDao;
        this.sqlSession = sqlSession;
    }

    @Override
    public List<NoticeComment> getCommentList(Long noticeId) {
        Map<String, Object> param = new HashMap<>();
        param.put("noticeId", noticeId);
        return noticeCommentDao.selectCommentList(sqlSession, param);
    }

    @Override
    @Transactional
    public int createComment(NoticeComment comment) {
        return noticeCommentDao.insertComment(sqlSession, comment);
    }

    @Override
    @Transactional
    public int updateComment(NoticeComment comment) {
        return noticeCommentDao.updateComment(sqlSession, comment);
    }

    @Override
    @Transactional
    public int deleteComment(Long noticeCommentId, Long memberNo) {
        Map<String, Object> param = new HashMap<>();
        param.put("noticeCommentId", noticeCommentId);
        param.put("memberNo", memberNo); // 본인 여부 체크
        return noticeCommentDao.deleteComment(sqlSession, param);
    }

}

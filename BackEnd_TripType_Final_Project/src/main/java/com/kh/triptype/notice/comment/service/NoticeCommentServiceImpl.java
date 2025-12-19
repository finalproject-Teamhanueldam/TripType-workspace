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

    /** 댓글 목록 */
    @Override
    public List<NoticeComment> getCommentList(Long noticeId) {
        Map<String, Object> param = new HashMap<>();
        param.put("noticeId", noticeId);

        return noticeCommentDao.selectCommentList(sqlSession, param);
    }

    /** 댓글 등록 */
    @Override
    @Transactional
    public int createComment(NoticeComment comment) {
        return noticeCommentDao.insertComment(sqlSession, comment);
    }

    /** 댓글 수정 */
    @Override
    @Transactional
    public int updateComment(NoticeComment comment) {
        return noticeCommentDao.updateComment(sqlSession, comment);
    }

    /** 댓글 삭제 */
    @Override
    @Transactional
    public int deleteComment(Long noticeCommentId) {
        Map<String, Object> param = new HashMap<>();
        param.put("noticeCommentId", noticeCommentId);

        return noticeCommentDao.deleteComment(sqlSession, param);
    }
}

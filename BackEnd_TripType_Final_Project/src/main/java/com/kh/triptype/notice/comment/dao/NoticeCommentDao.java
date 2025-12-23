package com.kh.triptype.notice.comment.dao;

import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.notice.comment.model.vo.NoticeComment;

@Repository
public class NoticeCommentDao {

    public List<NoticeComment> selectCommentList(SqlSessionTemplate sqlSession, Map<String, Object> param) {
        return sqlSession.selectList(
                "com.kh.triptype.notice.comment.dao.NoticeCommentDao.selectCommentList",
                param
        );
    }

    public int insertComment(SqlSessionTemplate sqlSession, NoticeComment comment) {
        return sqlSession.insert(
                "com.kh.triptype.notice.comment.dao.NoticeCommentDao.insertComment",
                comment
        );
    }

    public int updateComment(SqlSessionTemplate sqlSession, NoticeComment comment) {
        return sqlSession.update(
                "com.kh.triptype.notice.comment.dao.NoticeCommentDao.updateComment",
                comment
        );
    }

    public int deleteComment(SqlSessionTemplate sqlSession, Map<String, Object> param) {
        return sqlSession.update(
                "com.kh.triptype.notice.comment.dao.NoticeCommentDao.deleteComment",
                param
        );
    }
}

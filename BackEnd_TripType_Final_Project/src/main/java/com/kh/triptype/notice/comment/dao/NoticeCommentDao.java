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

    public List<NoticeComment> selectCommentListAdmin(SqlSessionTemplate sqlSession, Map<String, Object> param) {
        return sqlSession.selectList(
                "com.kh.triptype.notice.comment.dao.NoticeCommentDao.selectCommentListAdmin",
                param
        );
    }

    public int selectCommentCount(SqlSessionTemplate sqlSession, Map<String, Object> param) {
        return sqlSession.selectOne(
                "com.kh.triptype.notice.comment.dao.NoticeCommentDao.selectCommentCount",
                param
        );
    }

    public int selectCommentCountAdmin(SqlSessionTemplate sqlSession, Map<String, Object> param) {
        return sqlSession.selectOne(
                "com.kh.triptype.notice.comment.dao.NoticeCommentDao.selectCommentCountAdmin",
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

    public int deleteCommentByUser(SqlSessionTemplate sqlSession, Map<String, Object> param) {
        return sqlSession.update(
                "com.kh.triptype.notice.comment.dao.NoticeCommentDao.deleteCommentByUser",
                param
        );
    }

    public int deleteCommentByAdmin(SqlSessionTemplate sqlSession, Long noticeCommentId) {
        return sqlSession.update(
                "com.kh.triptype.notice.comment.dao.NoticeCommentDao.deleteCommentByAdmin",
                noticeCommentId
        );
    }
    
//    사용자별 권한
    public NoticeComment selectCommentById(SqlSessionTemplate sqlSession, Long commentId) {
        return sqlSession.selectOne(
            "com.kh.triptype.notice.comment.dao.NoticeCommentDao.selectCommentById",
            commentId
        );
    }

}

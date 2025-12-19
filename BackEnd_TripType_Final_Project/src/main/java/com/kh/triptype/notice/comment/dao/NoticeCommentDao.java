package com.kh.triptype.notice.comment.dao;

import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.notice.comment.model.vo.NoticeComment;

@Repository
public class NoticeCommentDao {

    /** 댓글 목록 */
    public List<NoticeComment> selectCommentList(SqlSessionTemplate sqlSession, Map<String, Object> param) {
        return sqlSession.selectList(
                "com.kh.triptype.notice.comment.dao.NoticeCommentDao.selectCommentList",
                param
        );
    }

    /** 댓글 등록 */
    public int insertComment(SqlSessionTemplate sqlSession, NoticeComment comment) {
        return sqlSession.insert(
                "com.kh.triptype.notice.comment.dao.NoticeCommentDao.insertComment",
                comment
        );
    }

    /** 댓글 수정 */
    public int updateComment(SqlSessionTemplate sqlSession, NoticeComment comment) {
        return sqlSession.update(
                "com.kh.triptype.notice.comment.dao.NoticeCommentDao.updateComment",
                comment
        );
    }

    /** 댓글 삭제 */
    public int deleteComment(SqlSessionTemplate sqlSession, Map<String, Object> param) {
        return sqlSession.update(
                "com.kh.triptype.notice.comment.dao.NoticeCommentDao.deleteComment",
                param
        );
    }
}

package com.kh.triptype.notice.dao;

import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.notice.model.vo.Notice;

@Repository
public class NoticeDao {

    /** 사용자 : 공지 목록 */
    public List<Notice> selectNoticeList(SqlSessionTemplate sqlSession) {
        return sqlSession.selectList(
                "com.kh.triptype.notice.dao.NoticeDao.selectNoticeList"
        );
    }

    /** 사용자 : 공지 상세 */
    public Notice selectNoticeDetail(SqlSessionTemplate sqlSession, Map<String, Object> param) {
        return sqlSession.selectOne(
                "com.kh.triptype.notice.dao.NoticeDao.selectNoticeDetail",
                param
        );
    }

    /** 관리자 : 공지 등록 */
    public int insertNotice(SqlSessionTemplate sqlSession, Notice notice) {
        return sqlSession.insert(
                "com.kh.triptype.notice.dao.NoticeDao.insertNotice",
                notice
        );
    }

    /** 관리자 : 공지 수정 */
    public int updateNotice(SqlSessionTemplate sqlSession, Notice notice) {
        return sqlSession.update(
                "com.kh.triptype.notice.dao.NoticeDao.updateNotice",
                notice
        );
    }

    /** 관리자 : 공지 삭제 (소프트 삭제) */
    public int deleteNotice(SqlSessionTemplate sqlSession, Map<String, Object> param) {
        return sqlSession.update(
                "com.kh.triptype.notice.dao.NoticeDao.deleteNotice",
                param
        );
    }

    /** 조회수 증가 */
    public int increaseViews(SqlSessionTemplate sqlSession, Map<String, Object> param) {
        return sqlSession.update(
                "com.kh.triptype.notice.dao.NoticeDao.increaseViews",
                param
        );
    }
}

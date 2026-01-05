package com.kh.triptype.notice.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.kh.triptype.notice.model.vo.Attachment;
import com.kh.triptype.notice.model.vo.Notice;

@Repository
public class NoticeDao {

    /* ================= 공지 ================= */
	public List<Notice> selectNoticeList(
	    SqlSessionTemplate sqlSession,
	    int startRow,
	    int endRow
	) {
	    Map<String, Object> param = new HashMap<>();
	    param.put("startRow", startRow);
	    param.put("endRow", endRow);

	    return sqlSession.selectList(
	        "com.kh.triptype.notice.dao.NoticeDao.selectNoticeList",
	        param
	    );
	}



    public Notice selectNoticeDetail(SqlSessionTemplate sqlSession, Map<String, Object> param) {
        return sqlSession.selectOne(
            "com.kh.triptype.notice.dao.NoticeDao.selectNoticeDetail",
            param
        );
    }

    public int insertNotice(SqlSessionTemplate sqlSession, Notice notice) {
        return sqlSession.insert(
            "com.kh.triptype.notice.dao.NoticeDao.insertNotice",
            notice
        );
    }

    public int updateNotice(SqlSessionTemplate sqlSession, Notice notice) {
        return sqlSession.update(
            "com.kh.triptype.notice.dao.NoticeDao.updateNotice",
            notice
        );
    }

    public int deleteNotice(SqlSessionTemplate sqlSession, Long noticeId) {
        return sqlSession.update(
            "com.kh.triptype.notice.dao.NoticeDao.deleteNotice",
            noticeId
        );
    }

    public int increaseViews(SqlSessionTemplate sqlSession, Map<String, Object> param) {
        return sqlSession.update(
            "com.kh.triptype.notice.dao.NoticeDao.increaseViews",
            param
        );
    }

    /* ================= 첨부파일 ================= */

    public int insertAttachment(SqlSessionTemplate sqlSession, Attachment attachment) {
        return sqlSession.insert(
            "com.kh.triptype.notice.dao.NoticeDao.insertAttachment",
            attachment
        );
    }

    /** 🔥 논리삭제 (update!) */
    public int deleteAttachment(SqlSessionTemplate sqlSession, Map<String, Object> param) {
        return sqlSession.update(
            "com.kh.triptype.notice.dao.NoticeDao.deleteAttachment",
            param
        );
    }

    /** 사용자용 (삭제 안 된 것만) */
    public List<Attachment> selectAttachmentList(SqlSessionTemplate sqlSession, Long noticeId) {
        return sqlSession.selectList(
            "com.kh.triptype.notice.dao.NoticeDao.selectAttachmentList",
            noticeId
        );
    }

    /** 관리자용 (삭제 포함) */
    public List<Attachment> selectAttachmentListAdmin(SqlSessionTemplate sqlSession, Long noticeId) {
        return sqlSession.selectList(
            "com.kh.triptype.notice.dao.NoticeDao.selectAttachmentListAdmin",
            noticeId
        );
    }
    
    /* ================= 관리자 ================= */
    public List<Notice> selectNoticeListAdmin(
    	    SqlSessionTemplate sqlSession,
    	    Map<String, Object> param
    	) {
    	    return sqlSession.selectList(
    	        "com.kh.triptype.notice.dao.NoticeDao.selectNoticeListAdmin",
    	        param
    	    );
    	}




    public int deleteAttachmentByNotice(SqlSessionTemplate sqlSession, Long noticeId) {
        return sqlSession.update(
            "com.kh.triptype.notice.dao.NoticeDao.deleteAttachmentByNotice",
            noticeId
        );
    }
    
    /* ================= 페이징 ================= */
    public int selectNoticeCount(SqlSessionTemplate sqlSession) {
        return sqlSession.selectOne(
            "com.kh.triptype.notice.dao.NoticeDao.selectNoticeCount"
        );
    }

    public int selectNoticeCountAdmin(SqlSessionTemplate sqlSession, Map<String, Object> param) {
    	return sqlSession.selectOne(
    		    "com.kh.triptype.notice.dao.NoticeDao.selectNoticeCountAdmin",
    		    param
    		);
    }



    
}

package com.kh.triptype.notice.comment.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.kh.triptype.auth.model.vo.AuthUser;


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
    public List<NoticeComment> getCommentList(Long noticeId, int startRow, int endRow, jakarta.servlet.http.HttpServletRequest request) {
        Map<String, Object> param = new HashMap<>();
        param.put("noticeId", noticeId);
        param.put("startRow", startRow);
        param.put("endRow", endRow);
        
        List<NoticeComment> list =
                noticeCommentDao.selectCommentList(sqlSession, param);

        // ⭐⭐⭐ isMine 세팅
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long loginMemberNo = null;

        if (auth != null && auth.getPrincipal() instanceof AuthUser) {
            AuthUser authUser = (AuthUser) auth.getPrincipal();
            loginMemberNo = (long) authUser.getMemberNo();
        }

        for (NoticeComment c : list) {
            if (loginMemberNo == null) {
                c.setMine(false);
            } else {
                c.setMine(c.getMemberNo().equals(loginMemberNo));
            }
        }


        return list;
    }

    @Override
    public List<NoticeComment> getCommentListAdmin(Long noticeId, int startRow, int endRow, String showDeleted) {
        Map<String, Object> param = new HashMap<>();
        param.put("noticeId", noticeId);
        param.put("startRow", startRow);
        param.put("endRow", endRow);
        param.put("showDeleted", showDeleted);
        return noticeCommentDao.selectCommentListAdmin(sqlSession, param);
    }

    @Override
    public int getCommentCount(Long noticeId) {
        Map<String, Object> param = new HashMap<>();
        param.put("noticeId", noticeId);
        return noticeCommentDao.selectCommentCount(sqlSession, param);
    }

    @Override
    public int getCommentCountAdmin(Long noticeId, String showDeleted) {
        Map<String, Object> param = new HashMap<>();
        param.put("noticeId", noticeId);
        param.put("showDeleted", showDeleted);
        return noticeCommentDao.selectCommentCountAdmin(sqlSession, param);
    }

	/*
	 * @Override
	 * 
	 * @Transactional public int createComment(NoticeComment comment) { return
	 * noticeCommentDao.insertComment(sqlSession, comment); }
	 */

	/*
	 * @Override
	 * 
	 * @Transactional public int updateComment(NoticeComment comment) { return
	 * noticeCommentDao.updateComment(sqlSession, comment); }
	 */

	/*
	 * @Override
	 * 
	 * @Transactional public int deleteCommentByUser(Long commentId, Long memberNo)
	 * { Map<String, Object> param = new HashMap<>(); param.put("noticeCommentId",
	 * commentId); param.put("memberNo", memberNo); return
	 * noticeCommentDao.deleteCommentByUser(sqlSession, param); }
	 */
    
    @Transactional
    @Override
    public int createComment(NoticeComment comment, Long memberNo) {

        if (memberNo == null) {
            throw new RuntimeException("로그인한 회원만 댓글 작성 가능");
        }

        if (comment.getNoticeCommentContent() == null
            || comment.getNoticeCommentContent().trim().isEmpty()) {
            throw new RuntimeException("댓글 내용이 비어있습니다.");
        }

        // 🔥 JWT 기준으로 memberNo 강제 세팅
        comment.setMemberNo(memberNo);

        return noticeCommentDao.insertComment(sqlSession, comment);
    }

    @Transactional
    @Override
    public int updateComment(NoticeComment comment, Long memberNo) {

        if (memberNo == null) {
            throw new RuntimeException("로그인 필요");
        }

        NoticeComment dbComment =
            noticeCommentDao.selectCommentById(
                sqlSession,
                comment.getNoticeCommentId()
            );

        if (dbComment == null) {
            throw new RuntimeException("댓글이 존재하지 않습니다.");
        }

        // 🔥 본인 댓글 검증 (JWT 기준)
        if (!dbComment.getMemberNo().equals(memberNo)) {
            throw new RuntimeException("댓글 수정 권한이 없습니다.");
        }

        return noticeCommentDao.updateComment(sqlSession, comment);
    }

    @Transactional
    @Override
    public int deleteCommentByUser(Long commentId, Long memberNo) {

        if (memberNo == null) {
            throw new RuntimeException("로그인 필요");
        }

        NoticeComment dbComment =
            noticeCommentDao.selectCommentById(sqlSession, commentId);

        // ⭐ 이미 삭제된 경우도 그냥 성공 처리
        if (dbComment == null || "Y".equals(dbComment.getNoticeCommentIsDel())) {
            return 0; // 또는 그냥 return 1;
        }

        if (!dbComment.getMemberNo().equals(memberNo)) {
            throw new RuntimeException("댓글 삭제 권한이 없습니다.");
        }

        Map<String, Object> param = new HashMap<>();
        param.put("noticeCommentId", commentId);
        param.put("memberNo", memberNo);

        return noticeCommentDao.deleteCommentByUser(sqlSession, param);
    }




    @Override
    @Transactional
    public int deleteCommentByAdmin(Long commentId) {
        return noticeCommentDao.deleteCommentByAdmin(sqlSession, commentId);
    }
}

import "../css/userNoticeDetail.css";
import NoticeCommentList from "./NoticeCommentList";
import NoticeCommentForm from "./NoticeCommentForm";

function UserNoticeDetail() {
  return (
    <div className="notice-detail-page">
      <h2 className="notice-detail-title">항공권 시스템 점검 안내</h2>
      <div className="notice-meta">
        2025-01-01 · 조회수 123
      </div>

      <div className="notice-content-box">
        안정적인 항공권 가격 비교 서비스를 위해
        시스템 점검이 예정되어 있습니다.
      </div>

      {/* 댓글 */}
      <NoticeCommentList />
      <NoticeCommentForm />
    </div>
  );
}

export default UserNoticeDetail;

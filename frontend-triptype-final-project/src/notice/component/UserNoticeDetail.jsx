import "../css/UserNoticeDetail.css";
import NoticeComment from "./NoticeComment";
// import NoticeCommentForm from "./NoticeCommentForm";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";


function UserNoticeDetail() {
  const navigate = useNavigate();
  return (
    <div className="notice-detail-page">
      {/* 제목 + 목록으로 */}
      <div className="notice-title-row">
        <h2 className="notice-detail-title">
          항공권 시스템 점검 안내
        </h2>

        <button
          className="notice-back-btn icon"
          onClick={() => navigate(-1)}
        >
          <FaAngleLeft />
          목록으로
        </button>
      </div>
      <div className="notice-meta">
        2025-01-01 · 조회수 123
      </div>

      <div className="notice-content-box">
        안정적인 항공권 가격 비교 서비스를 위해
        시스템 점검이 예정되어 있습니다.
      </div>

      {/* 댓글 */}
      {/* <NoticeCommentForm /> */}
      <NoticeComment />
            
    </div>
  );
}

export default UserNoticeDetail;

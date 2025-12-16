import "../css/notice.css";
import { useNavigate } from "react-router-dom";

function AdminNoticeList() {
  const navigate = useNavigate();

  return (
    <div className="notice-container">
      <h2 className="notice-title">공지사항 관리</h2>

      <button
        className="admin-btn"
        onClick={() => navigate("/admin/notice/write")}
      >
        공지 등록
      </button>

      <div className="notice-list">
        <div className="notice-item">
          <span>[중요] 항공권 점검 공지</span>
          <div className="admin-btn-group">
            <button className="admin-btn">수정</button>
            <button className="admin-btn">삭제</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNoticeList;

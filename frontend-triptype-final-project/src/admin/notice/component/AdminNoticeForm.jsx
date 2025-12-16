import "../css/notice.css";
import { useNavigate } from "react-router-dom";

function AdminNoticeForm() {
  const navigate = useNavigate();

  return (
    <div className="notice-container">
      <h2 className="notice-title">공지사항 등록</h2>

      <input
        type="text"
        placeholder="제목"
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <textarea
        rows="6"
        placeholder="내용"
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <label>
        <input type="checkbox" /> 중요 공지
      </label>

      <div className="admin-btn-group" style={{ marginTop: "20px" }}>
        <button className="admin-btn">저장</button>
        <button
          className="admin-btn"
          onClick={() => navigate("/admin/notice")}
        >
          취소
        </button>
      </div>
    </div>
  );
}

export default AdminNoticeForm;

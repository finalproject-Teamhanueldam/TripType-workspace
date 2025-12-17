import "../css/AdminCommon.css";
import "../css/AdminNoticeForm.css";

import { useNavigate } from "react-router-dom";

function AdminNoticeForm() {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <h2 className="page-title">공지사항 등록</h2>

      <div className="form-card">
        <input
          className="notice-input"
          placeholder="공지 제목을 입력하세요"
        />

        <textarea
          className="notice-textarea"
          rows="10"
          placeholder="공지 내용을 입력하세요"
        />

        <label className="important-check">
          <input type="checkbox" />
          중요 공지로 등록
        </label>

        <div className="attachment-box">
          <label>첨부파일</label>
          <input type="file" multiple />
          <ul className="file-list">
            <li>
              점검안내.pdf
              <button className="btn-ghost">삭제</button>
            </li>
          </ul>
        </div>

        <div className="btn-group right">
          <button className="btn btn-primary">저장</button>
          <button
            className="btn btn-outline"
            onClick={() => navigate("/admin/notice")}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminNoticeForm;

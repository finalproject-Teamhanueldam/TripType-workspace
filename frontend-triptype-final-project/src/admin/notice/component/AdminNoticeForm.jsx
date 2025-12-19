import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/AdminCommon.css";
import "../css/AdminNoticeForm.css";

function AdminNoticeForm() {
  const navigate = useNavigate();

  /* ===== Form State ===== */
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [files, setFiles] = useState([]);

  /* ===== 파일 선택 ===== */
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  };

  /* ===== 파일 삭제 ===== */
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /* ===== 저장 ===== */
  const handleSubmit = () => {
    if (!title.trim()) {
      alert("공지 제목을 입력하세요.");
      return;
    }

    if (!content.trim()) {
      alert("공지 내용을 입력하세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("important", isImportant ? "Y" : "N");

    files.forEach((file) => {
      formData.append("files", file);
    });

    console.log("등록 FormData", formData);

    alert("공지사항이 등록되었습니다.");
    navigate("/admin/notice");
  };

  return (
    <div className="admin-page">
      <h2 className="page-title">공지사항 등록</h2>

      <div className="form-card">
        {/* 제목 */}
        <div className="form-group">
          <label className="form-label">공지 제목</label>
          <input
            className="notice-input"
            placeholder="공지 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 내용 */}
        <div className="form-group">
          <label className="form-label">공지 내용</label>
          <textarea
            className="notice-textarea"
            placeholder="공지 내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* 중요 공지 */}
        <div className="form-group inline">
          <label className="important-check">
            <input
              type="checkbox"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
            />
            중요 공지로 등록
          </label>
        </div>

        {/* 첨부파일 */}
        <div className="form-group">
          <label className="form-label">첨부파일</label>

          <div className="attachment-box">
            <div className="file-upload-row">
              <label className="file-btn">
                파일 선택
                <input type="file" multiple hidden onChange={handleFileChange} />
              </label>
            </div>

            {files.length > 0 && (
              <ul className="file-list">
                {files.map((file, index) => (
                  <li key={index}>
                    <span>{file.name}</span>
                    <button
                      className="btn-ghost"
                      onClick={() => removeFile(index)}
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className="form-actions">
          <button
            className="btn btn-outline"
            onClick={() => navigate("/admin/notice")}
          >
            취소
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminNoticeForm;

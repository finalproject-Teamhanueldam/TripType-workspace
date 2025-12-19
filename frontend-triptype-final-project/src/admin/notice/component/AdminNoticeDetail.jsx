import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaTrashAlt, FaSearch } from "react-icons/fa";
import "../css/AdminCommon.css";
import "../css/AdminNoticeDetail.css";
import { NoticeCommentDummy } from "../data/NoticeCommentDummy";
import HighlightText from "../util/HighlightText";

const AdminNoticeDetail = () => {
  const noticeId = 1;

  const [deleteMode, setDeleteMode] = useState(false);
  const [checkedIds, setCheckedIds] = useState([]);

  /* ===== 댓글 검색 ===== */
  const [searchType, setSearchType] = useState("memberId");
  const [keyword, setKeyword] = useState("");

  /* ===== 댓글 목록 (검색 + 최신순) ===== */
  const comments = useMemo(() => {
  const lowerKeyword = keyword.trim().toLowerCase();

  return NoticeCommentDummy
    .filter((c) => c.noticeId === noticeId)
    .filter((c) => {
      if (!lowerKeyword) return true;

      return (
        String(c.memberId).toLowerCase().includes(lowerKeyword) ||
        c.content.toLowerCase().includes(lowerKeyword)
      );
    })
    .sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [keyword]);

  const toggleDeleteMode = () => {
    setDeleteMode((prev) => !prev);
    setCheckedIds([]);
  };

  const toggleCheck = (id) => {
    setCheckedIds((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id]
    );
  };

  const handleSelectedDelete = () => {
    if (checkedIds.length === 0) {
      alert("삭제할 댓글을 선택하세요.");
      return;
    }
    alert(`선택 삭제: ${checkedIds.join(", ")}`);
  };

  const handleAllCheck = (checked) => {
  if (checked) {
    setCheckedIds(comments.map((c) => c.id));
  } else {
    setCheckedIds([]);
  }
};

  /* ===== 첨부파일 ===== */
  const [existingFiles, setExistingFiles] = useState([
    { id: 1, name: "점검안내.pdf" },
    { id: 2, name: "서비스정책.docx" },
  ]);

  const [deletedFileIds, setDeletedFileIds] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...selected]);
    e.target.value = "";
  };

  const removeExistingFile = (file) => {
    setExistingFiles((prev) => prev.filter((f) => f.id !== file.id));
    setDeletedFileIds((prev) => [...prev, file.id]);
  };

  const removeNewFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="admin-page">
      <h2 className="page-title">공지사항 상세 / 수정</h2>

      {/* ===== 공지 상세 ===== */}
      <div className="detail-card">
        <input
          type="text"
          className="detail-title-input"
          value="공지 제목 예시"
          readOnly
        />

        <div className="detail-content-box">
          공지 내용 예시입니다. 시스템 점검 관련 공지입니다.
        </div>

        {/* ===== 첨부파일 ===== */}
        <div className="form-group">
          <label className="form-label">첨부파일</label>

          <div className="attachment-box">
            <div className="file-upload-row">
              <label className="file-btn">
                파일 추가
                <input type="file" multiple hidden onChange={handleFileChange} />
              </label>
            </div>

            {existingFiles.length > 0 && (
              <>
                <div className="file-section-title">기존 첨부파일</div>
                <ul className="file-list">
                  {existingFiles.map((file) => (
                    <li key={file.id}>
                      <span>{file.name}</span>
                      <button
                        className="btn-ghost"
                        onClick={() => removeExistingFile(file)}
                      >
                        삭제
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {newFiles.length > 0 && (
              <>
                <div className="file-section-title">신규 첨부파일</div>
                <ul className="file-list">
                  {newFiles.map((file, index) => (
                    <li key={index}>
                      <span>{file.name}</span>
                      <button
                        className="btn-ghost"
                        onClick={() => removeNewFile(index)}
                      >
                        삭제
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="detail-actions">
          <button className="btn btn-primary">수정</button>
          <button className="btn btn-danger">삭제</button>
          <Link to="/admin/notice">
            <button className="btn btn-outline">목록</button>
          </Link>
        </div>
      </div>

      {/* ===== 댓글 관리 ===== */}
      <div className="detail-card">
        <div className="comment-header">
          <h3 className="page-title">댓글 관리</h3>

          <div className="comment-header-right">
            {/* 검색 */}
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                className="search-input"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="회원 ID 또는 댓글 내용 검색"
              />
            </div>

            {/* 삭제모드 */}
            <button
              className={`trash-btn ${deleteMode ? "active" : ""}`}
              onClick={toggleDeleteMode}
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>

        <div className={`comment-table ${deleteMode ? "delete-mode" : ""}`}>
          {/* ===== Header ===== */}
          <div className="comment-row header">
            <div>ID</div>
            <div>회원ID</div>
            <div>내용</div>
            <div>등록일</div>
            <div>수정일</div>
            <div>삭제여부</div>
            <div className="checkbox-col">
              {deleteMode && (
                <input
                  type="checkbox"
                  checked={
                    comments.length > 0 &&
                    checkedIds.length === comments.length
                  }
                  onChange={(e) =>
                    handleAllCheck(e.target.checked)
                  }
                />
              )}
            </div>
          </div>

          {/* ===== List ===== */}
          {comments.length === 0 ? (
            <div className="empty-row">
              검색 결과가 없습니다.
            </div>
          ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="comment-row"
              onClick={() => deleteMode && toggleCheck(c.id)}
            >
              <div>{c.id}</div>

              <div className="member-id">
                <HighlightText text={c.memberId} keyword={keyword} />
              </div>

              <div className="comment-text">
                <HighlightText text={c.content} keyword={keyword} />
              </div>

              <div>{c.createdAt}</div>
              <div>{c.updatedAt || "-"}</div>

              <div>
                <span
                  className={`badge ${
                    c.isDel === "Y" ? "danger" : "primary"
                  }`}
                >
                  {c.isDel}
                </span>
              </div>

              <div
                className="checkbox-col"
                onClick={(e) => e.stopPropagation()}
              >
                {deleteMode && (
                  <input
                    type="checkbox"
                    checked={checkedIds.includes(c.id)}
                    onChange={() => toggleCheck(c.id)}
                  />
                )}
              </div>
            </div>
          ))
          )}
        </div>
      </div>

      {/* ===== Floating Delete Bar ===== */}
      {deleteMode && (
        <div className="delete-floating-bar">
          <div className="delete-info">
            선택된 댓글
            <strong className="delete-count">
              {checkedIds.length}
            </strong>
            건
          </div>

          <div className="delete-actions">
            <button className="btn btn-outline" onClick={toggleDeleteMode}>
              취소
            </button>
            <button className="btn btn-danger" onClick={handleSelectedDelete}>
              선택 삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNoticeDetail;

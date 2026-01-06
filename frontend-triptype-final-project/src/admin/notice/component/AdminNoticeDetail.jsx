import { useState, useMemo, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaTrashAlt, FaSearch } from "react-icons/fa";
import "../css/AdminCommon.css";
import "../css/AdminNoticeDetail.css";
import HighlightText from "../util/HighlightText";
import axios from "axios";

const AdminNoticeDetail = () => {
  const { noticeId } = useParams();
  const navigate = useNavigate();

  const [deleteMode, setDeleteMode] = useState(false);
  const [checkedIds, setCheckedIds] = useState([]);

  const [keyword, setKeyword] = useState("");

  const [notice, setNotice] = useState(null);
  const [comments, setComments] = useState([]);

  const [existingFiles, setExistingFiles] = useState([]);
  const [deletedFileIds, setDeletedFileIds] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  const [showDeleted, setShowDeleted] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 공지사항 상세 조회
  const fetchNoticeDetail = async () => {
    if (!noticeId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/notice/${noticeId}`);
      console.log("공지 상세 응답:", res.data);
      console.log("attachments:", res.data.attachmentList);
      setNotice(res.data);
      setExistingFiles(res.data.attachmentList || []);
    } catch (err) {
      console.error(err);
    }
  };

  // 댓글 조회
  const fetchComments = async () => {
    if (!noticeId) return;
    try {
      const startRow = (currentPage - 1) * pageSize + 1;
      const endRow = currentPage * pageSize;
      const res = await axios.get(
        `${API_BASE_URL}/admin/notice/${noticeId}/comment`,
        { params: { startRow, endRow, showDeleted: showDeleted ? "Y" : "N" } }
      );

      const data = res.data;
      setComments(Array.isArray(data.comments) ? data.comments : data || []);
      setTotalCount(
        data.totalCount ?? (Array.isArray(data.comments) ? data.comments.length : (Array.isArray(data) ? data.length : 0))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (noticeId) {
      fetchNoticeDetail();
      fetchComments();
    }
  }, [noticeId]);

  useEffect(() => {
    if (noticeId) fetchComments();
  }, [noticeId, showDeleted, currentPage]);

  // 댓글 필터 + 정렬
  const filteredComments = useMemo(() => {
    if (!comments) return [];
    const lowerKeyword = keyword.trim().toLowerCase();
    return comments
      .filter(c => showDeleted || c.noticeCommentIsDel !== "Y")
      .filter(c => !lowerKeyword || String(c.memberNo).toLowerCase().includes(lowerKeyword) || c.noticeCommentContent.toLowerCase().includes(lowerKeyword))
      .sort((a, b) => new Date(b.noticeCommentCreatedAt) - new Date(a.noticeCommentCreatedAt));
  }, [comments, keyword, showDeleted]);

  // 체크박스 관련
  const toggleDeleteMode = () => {
    setDeleteMode(prev => !prev);
    setCheckedIds([]);
  };
  const toggleCheck = id => {
    setCheckedIds(prev => (prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]));
  };
  const handleAllCheck = checked => {
    if (checked) setCheckedIds(filteredComments.map(c => c.noticeCommentId));
    else setCheckedIds([]);
  };
  const handleSelectedDelete = async () => {
    if (checkedIds.length === 0) return alert("삭제할 댓글을 선택하세요.");
    try {
      await Promise.all(
        checkedIds.map(id =>
          axios.delete(`${API_BASE_URL}/admin/notice/${noticeId}/comment/${id}`)
        )
      );
      fetchComments();
      setCheckedIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  if (!notice) return <div>공지사항 정보를 불러오는 중...</div>;


  // ===== 공지 수정 =====
  const handleNoticeChange = (e) => {
    const { name, value } = e.target;
    setNotice((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...selected]);
    e.target.value = "";
  };

  const removeExistingFile = (file) => {
    setExistingFiles((prev) =>
    prev.filter((f) => f.noticeAttachmentId !== file.noticeAttachmentId)
  );
  setDeletedFileIds((prev) => [
    ...prev,
    file.noticeAttachmentId,
  ]);
  };

  const removeNewFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNoticeUpdate = async () => {
    try {
      const formData = new FormData();

      // ✔️ 공지 기본 정보 (attachmentList 없음)
      formData.append(
        "notice",
        new Blob(
          [
            JSON.stringify({
              noticeId: notice.noticeId,
              noticeTitle: notice.noticeTitle,
              noticeContent: notice.noticeContent,
              noticeIsImportant: notice.noticeIsImportant
            })
          ],
          { type: "application/json" }
        )
      );

      // ✔️ 삭제할 첨부파일 ID 목록
      formData.append(
        "deletedFileIds",
        new Blob(
          [JSON.stringify(deletedFileIds)],
          { type: "application/json" }
        )
      );

      // ✔️ 신규 파일
      newFiles.forEach(file => {
        formData.append("files", file);
      });

      await axios.put(
        `${API_BASE_URL}/admin/notice/${noticeId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("공지사항이 수정되었습니다.");
      fetchNoticeDetail();
      setNewFiles([]);
      setDeletedFileIds([]);
    } catch (err) {
      console.error(err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };


  return (
    <div className="admin-page">
      <h2 className="page-title">공지사항 상세 / 수정</h2>

      {/* 공지 상세 */}
      <div className="detail-card">
        <input
          type="text"
          className="detail-title-input"
          name="noticeTitle"
          value={notice.noticeTitle}
          onChange={handleNoticeChange}
        />

        <textarea
          className="detail-content-box"
          name="noticeContent"
          value={notice.noticeContent}
          onChange={handleNoticeChange}
        />

        {/* 첨부파일 */}
        <div className="form-group">
          <label className="form-label">첨부파일</label>

          <div className="attachment-box">
            {/* 파일 추가 버튼 */}
            <div className="file-upload-row">
              <label className="file-btn">
                파일 추가
                <input type="file" multiple hidden onChange={handleFileChange} />
              </label>
            </div>

            {/* 기존 첨부파일 */}
            {existingFiles.length > 0 && (
              <>
                <div className="file-section-title">기존 첨부파일</div>
                <ul className="file-list">
                  {existingFiles
                    .filter(file => file !== null)
                    .map(file => (
                      <li key={file.noticeAttachmentId} className="file-item">
                        <a
                          href={`${API_BASE_URL}/${file.noticeAttachmentUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="file-name"
                        >
                          {file.noticeAttachmentName}
                        </a>
                        <button
                          type="button"
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

    {/* 신규 첨부파일 */}
    {newFiles.length > 0 && (
      <>
        <div className="file-section-title">신규 첨부파일</div>
        <ul className="file-list">
          {newFiles.map((file, index) => (
            <li key={index} className="file-item">
              <span className="file-name">{file.name}</span>
              <button
                type="button"
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
          <button className="btn btn-primary" onClick={handleNoticeUpdate}>
            수정
          </button>
          <button
            className="btn btn-danger"
            onClick={async () => {
              await axios.delete(`${API_BASE_URL}/admin/notice/${noticeId}`);
              alert("삭제되었습니다.");
              navigate("/admin/notice");
            }}
          >
            삭제
          </button>
          <Link to="/admin/notice">
            <button className="btn btn-outline">목록</button>
          </Link>
        </div>
      </div>

      {/* 댓글 관리 */}
      <div className="detail-card">
        <div className="comment-header">
          <h3 className="page-title">댓글 관리</h3>

          {/* ✅ 삭제여부 필터 */}
          <div className="filter-box">
            <button
              className={`filter-toggle ${showDeleted ? "active" : ""}`}
              onClick={() => setShowDeleted(!showDeleted)}
              type="button"
            >
              삭제된 댓글 표시
            </button>
          </div>

          <div className="comment-header-right">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                className="search-input"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="회원 ID 또는 댓글 내용 검색"
              />
            </div>

            <button
              className={`trash-btn ${deleteMode ? "active" : ""}`}
              onClick={toggleDeleteMode}
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>

        <div className={`comment-table ${deleteMode ? "delete-mode" : ""}`}>
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
                    filteredComments.length > 0 &&
                    checkedIds.length === filteredComments.length
                  }
                  onChange={(e) => handleAllCheck(e.target.checked)}
                />
              )}
            </div>
          </div>

          {filteredComments.length === 0 ? (
            <div className="empty-row">검색 결과가 없습니다.</div>
          ) : (
            filteredComments.map((c) => (
              <div
                key={c.noticeCommentId}
                className={`comment-row ${
                  c.noticeCommentIsDel === "Y" ? "deleted" : ""
                }`}
                onClick={() => deleteMode && toggleCheck(c.noticeCommentId)}
              >
                <div>{c.noticeCommentId}</div>
                <div className="member-id">
                  <HighlightText text={c.memberNo} keyword={keyword} />
                </div>
                <div className="comment-text">
                  <HighlightText text={c.noticeCommentContent} keyword={keyword} />
                </div>
                <div>{c.noticeCommentCreatedAt}</div>
                <div>{c.noticeCommentUpdatedAt || "-"}</div>
                <div>
                  <span
                    className={`badge ${
                      c.noticeCommentIsDel === "Y" ? "danger" : "primary"
                    }`}
                  >
                    {c.noticeCommentIsDel}
                  </span>
                </div>
                <div
                  className="checkbox-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  {deleteMode && (
                    <input
                      type="checkbox"
                      checked={checkedIds.includes(c.noticeCommentId)}
                      onChange={() => toggleCheck(c.noticeCommentId)}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 페이징 */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
        >
          이전
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            className={page === currentPage ? "active" : ""}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          다음
        </button>
      </div>


      {deleteMode && (
        <div className="delete-floating-bar">
          <div className="delete-info">
            선택된 댓글
            <strong className="delete-count">{checkedIds.length}</strong>
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

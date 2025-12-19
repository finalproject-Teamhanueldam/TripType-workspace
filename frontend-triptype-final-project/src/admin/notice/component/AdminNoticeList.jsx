import "../css/AdminCommon.css";
import "../css/AdminNoticeList.css";

import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { FaTrashAlt, FaSearch } from "react-icons/fa";
import { NoticeDummy } from "../data/NoticeDummy";

import HighlightText from "../util/HighlightText";

function AdminNoticeList() {
  const notices = NoticeDummy;
  const navigate = useNavigate();

  const [deleteMode, setDeleteMode] = useState(false);
  const [checked, setChecked] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [sortType, setSortType] = useState("latest");

  /* ===== 검색 + 정렬 ===== */
  const filteredNotices = useMemo(() => {
    let result = notices;

    if (keyword.trim()) {
      result = result.filter(
        (n) =>
          n.title.includes(keyword) || n.content.includes(keyword)
      );
    }

    return [...result].sort((a, b) => {
      if (a.important !== b.important) {
        return a.important === "Y" ? -1 : 1;
      }

      if (sortType === "views") {
        return b.views - a.views;
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [keyword, sortType, notices]);

  /* ===== 체크 토글 ===== */
  const toggleOne = (id) => {
    setChecked((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id]
    );
  };

  const toggleAll = (e) => {
    if (e.target.checked) {
      setChecked(filteredNotices.map((n) => n.id));
    } else {
      setChecked([]);
    }
  };

  const deleteSelected = () => {
    if (checked.length === 0) return;
    alert(`삭제 예정 ID: ${checked.join(", ")}`);
  };

  return (
    <div className="admin-page">
      <h2 className="page-title">공지사항 관리</h2>

      {/* ===== 상단 컨트롤 ===== */}
      <div className="admin-controls">
        <div className="left">
          <span className="total-count">
            총 {filteredNotices.length}건
          </span>

          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              className="search-input"
              placeholder="공지 제목 또는 내용 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="sort-box">
            <button
              className={sortType === "latest" ? "active" : ""}
              onClick={() => setSortType("latest")}
            >
              최신순
            </button>
            <button
              className={sortType === "views" ? "active" : ""}
              onClick={() => setSortType("views")}
            >
              조회수순
            </button>
          </div>
        </div>

        <div className="right">
          <button
            className={`btn btn-ghost ${deleteMode ? "active" : ""}`}
            onClick={() => {
              setDeleteMode(!deleteMode);
              setChecked([]);
            }}
            title="삭제 모드"
          >
            <FaTrashAlt />
          </button>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/notice/write")}
          >
            + 공지 등록
          </button>
        </div>
      </div>

      {/* ===== 테이블 ===== */}
      <div className={`notice-table ${deleteMode ? "delete-mode" : ""}`}>
        <div className="notice-row header">
          <span>ID</span>
          <span>중요</span>
          <span>제목</span>
          <span>내용</span>
          <span>작성일</span>
          <span>수정일</span>
          <span>조회수</span>
          <span>삭제여부</span>

          {deleteMode && (
            <span className="check-col">
              <input type="checkbox" onChange={toggleAll} />
            </span>
          )}
        </div>

        {filteredNotices.length === 0 && (
          <div className="empty-row">
            검색 결과가 없습니다.
          </div>
        )}

        {filteredNotices.map((n) => (
          <div
            key={n.id}
            className={`notice-row ${
              deleteMode ? "delete-mode" : ""
            }`}
            onClick={() => {
              if (deleteMode) {
                toggleOne(n.id); // ✅ row 클릭 = 체크 토글
              } else {
                navigate(`/admin/notice/${n.id}`); // ✅ 상세 이동
              }
            }}
          >
            <span>{n.id}</span>

            <span>
              {n.important === "Y" ? (
                <span className="badge-important">Y</span>
              ) : (
                <span className="badge-important-normal">N</span>
              )}
            </span>

            <span className="title">
              <HighlightText text={n.title} keyword={keyword} />
            </span>

            <span className="content-preview">
              <HighlightText text={n.content} keyword={keyword} />
            </span>
            <span>{n.createdAt}</span>
            <span>{n.updatedAt}</span>
            <span>{n.views}</span>
            <span className="del-flag">{n.isDel}</span>

            {deleteMode && (
              <span
                className="check-col"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={checked.includes(n.id)}
                  onChange={() => toggleOne(n.id)}
                />
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ===== 삭제 액션 바 ===== */}
      {deleteMode && (
        <div className="delete-floating-bar">
          <div className="delete-info">
            선택된 공지{" "}
            <strong className="delete-count">
              {checked.length}
            </strong>
            건
          </div>

          <div className="delete-actions">
            <button
              className="btn btn-outline"
              onClick={() => {
                setDeleteMode(false);
                setChecked([]);
              }}
            >
              취소
            </button>

            <button
              className="btn btn-danger"
              onClick={deleteSelected}
            >
              선택 삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminNoticeList;

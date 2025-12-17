import "../css/adminCommon.css";
import "../css/adminNoticeList.css";

import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { FaTrashAlt, FaSearch } from "react-icons/fa";

function AdminNoticeList() {
  const navigate = useNavigate();
  const [deleteMode, setDeleteMode] = useState(false);
  const [checked, setChecked] = useState([]);
  const [keyword, setKeyword] = useState("");

  /* ===== 샘플 데이터 ===== */
  const notices = [
    {
      id: 1,
      important: "Y",
      title: "항공권 시스템 점검 안내",
      content: "시스템 안정화를 위한 점검이 진행됩니다.",
      createdAt: "2025-01-10",
      updatedAt: "2025-01-12",
      views: 324,
      isDel: "N",
    },
    {
      id: 2,
      important: "N",
      title: "이벤트 종료 안내",
      content: "프로모션 이벤트가 종료되었습니다.",
      createdAt: "2025-01-08",
      updatedAt: "2025-01-08",
      views: 98,
      isDel: "N",
    },
  ];

  /* ===== 검색 필터 ===== */
  const filteredNotices = useMemo(() => {
    if (!keyword.trim()) return notices;

    return notices.filter(n =>
      n.title.includes(keyword) || n.content.includes(keyword)
    );
  }, [keyword, notices]);

  const goDetail = (id) => {
    if (deleteMode) return;
    navigate(`/admin/notice/${id}`);
  };

  const toggleAll = (e) => {
    if (e.target.checked) {
      setChecked(filteredNotices.map(n => n.id));
    } else {
      setChecked([]);
    }
  };

  const toggleOne = (id) => {
    setChecked(prev =>
      prev.includes(id)
        ? prev.filter(v => v !== id)
        : [...prev, id]
    );
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
          <span className="check-col">
            {deleteMode && (
              <input type="checkbox" onChange={toggleAll} />
            )}
          </span>
        </div>

        {filteredNotices.length === 0 && (
          <div className="empty-row">
            검색 결과가 없습니다.
          </div>
        )}

        {filteredNotices.map(n => (
          <div
            key={n.id}
            className="notice-row"
            onClick={() => goDetail(n.id)}
          >
            <span>{n.id}</span>
            <span className="badge important">{n.important}</span>
            <span className="title">{n.title}</span>
            <span className="content-preview">{n.content}</span>
            <span>{n.createdAt}</span>
            <span>{n.updatedAt}</span>
            <span>{n.views}</span>
            <span className="del-flag">{n.isDel}</span>
            <span className="check-col">
              <input
                type="checkbox"
                className={deleteMode ? "visible" : ""}
                checked={checked.includes(n.id)}
                onClick={(e) => e.stopPropagation()}
                onChange={() => toggleOne(n.id)}
              />
            </span>
          </div>
        ))}
      </div>

      {/* ===== 삭제 액션 바 ===== */}
      <div className={`delete-action-bar ${deleteMode ? "show" : ""}`}>
        <span>{checked.length}건 선택됨</span>
        <button
          className="btn btn-danger"
          disabled={checked.length === 0}
          onClick={deleteSelected}
        >
          선택 삭제
        </button>
      </div>
    </div>
  );
}

export default AdminNoticeList;

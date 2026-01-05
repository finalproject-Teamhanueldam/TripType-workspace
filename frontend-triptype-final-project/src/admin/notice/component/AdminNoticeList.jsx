import "../css/AdminCommon.css";
import "../css/AdminNoticeList.css";

import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { FaTrashAlt, FaSearch } from "react-icons/fa";
import axios from "axios"; // 🔹 추가

import HighlightText from "../util/HighlightText";

function AdminNoticeList() {

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  // 🔹 더미 제거 → 서버 데이터
  const [notices, setNotices] = useState([]);

  const [deleteMode, setDeleteMode] = useState(false);
  const [checked, setChecked] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [sortType, setSortType] = useState("latest");

  const [showDeleted, setShowDeleted] = useState(false);

  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState(null);

  /* ===== 공지 목록 조회 ===== */
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/admin/notice`, {
        params: { 
          page,
          showDeleted: showDeleted ? "Y" : "N"
         }
      })
      .then(res => {
        setNotices(res.data.list);
        setPageInfo(res.data.pageInfo);
      })
      .catch(console.error);
  }, [page, showDeleted]);

  /* ===== 검색 + 정렬 ===== */
  const filteredNotices = useMemo(() => {
    let result = notices;

    if (keyword.trim()) {
      result = result.filter(
        (n) =>
          n.noticeTitle.includes(keyword) ||
          n.noticeContent.includes(keyword)
      );
    }

    return [...result].sort((a, b) => {
      if (a.noticeIsImportant !== b.noticeIsImportant) {
        return a.noticeIsImportant === "Y" ? -1 : 1;
      }

      if (sortType === "views") {
        return b.noticeViews - a.noticeViews;
      }

      return (
        new Date(b.noticeCreatedAt) -
        new Date(a.noticeCreatedAt)
      );
    });
  }, [keyword, sortType, notices, showDeleted]);

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
      setChecked(filteredNotices.map((n) => n.noticeId));
    } else {
      setChecked([]);
    }
  };

  /* ===== 선택 삭제 ===== */
  const deleteSelected = async () => {
    if (checked.length === 0) return;

    if (!window.confirm("선택한 공지를 삭제하시겠습니까?"))
      return;

    try {
      await Promise.all(
        checked.map((id) =>
          axios.delete(
            `${API_BASE_URL}/admin/notice/${id}`
          )
        )
      );

      // 🔹 화면 즉시 반영
      setNotices((prev) =>
        prev.filter((n) => !checked.includes(n.noticeId))
      );

      setChecked([]);
      setDeleteMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  // 페이징
  const movePage = (page) => {
    setPage(page);
  };


  return (
    <div className="admin-page">
      <h2 className="page-title">공지사항 관리</h2>

      {/* ===== 상단 컨트롤 ===== */}
      <div className="admin-controls">
        <div className="left">
          <span className="total-count">
            총 {pageInfo?.listCount ?? 0}건
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

        {/* 삭제여부 필터링 */}
        <button
          className={`filter-toggle ${showDeleted ? "active" : ""}`}
          onClick={() => {
            setShowDeleted(!showDeleted);
            setPage(1); // 🔥 매우 중요
          }}
          type="button"
        >
          삭제된 공지 표시
        </button>




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
              key={n.noticeId}
              className={`notice-row
                ${n.noticeIsDel === "Y" ? "deleted" : ""}
                ${deleteMode ? "delete-mode" : ""}
              `}
              onClick={() => {
                if (deleteMode) {
                  toggleOne(n.noticeId);
                } else {
                  navigate(`/admin/notice/${n.noticeId}`);
                }
              }}
            >
            <span>{n.noticeId}</span>

            <span>
              {n.noticeIsImportant === "Y" ? (
                <span className="badge-important">Y</span>
              ) : (
                <span className="badge-important-normal">N</span>
              )}
            </span>

            <span className="title">
              <HighlightText
                text={n.noticeTitle}
                keyword={keyword}
              />
            </span>

            <span className="content-preview">
              <HighlightText
                text={n.noticeContent}
                keyword={keyword}
              />
            </span>

            <span>{n.noticeCreatedAt}</span>
            <span>{n.noticeUpdatedAt}</span>
            <span>{n.noticeViews}</span>
            <span className="del-flag">{n.noticeIsDel}</span>

            {deleteMode && (
              <span
                className="check-col"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={checked.includes(n.noticeId)}
                  onChange={() => toggleOne(n.noticeId)}
                />
              </span>
            )}
          </div>
        ))}
      </div>

      {/* 페이징 */}
      {pageInfo && (
        <div className="pagination">
          {pageInfo.currentPage > 1 && (
            <button onClick={() => movePage(pageInfo.currentPage - 1)}>
              이전
            </button>
          )}

          {Array.from(
            { length: pageInfo.endPage - pageInfo.startPage + 1 },
            (_, i) => pageInfo.startPage + i
          ).map((p) => (
            <button
              key={p}
              className={p === pageInfo.currentPage ? "active" : ""}
              onClick={() => movePage(p)}
            >
              {p}
            </button>
          ))}

          {pageInfo.currentPage < pageInfo.maxPage && (
            <button onClick={() => movePage(pageInfo.currentPage + 1)}>
              다음
            </button>
          )}
        </div>
      )}




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

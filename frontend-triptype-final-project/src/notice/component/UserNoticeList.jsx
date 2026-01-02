import "../css/UserNoticeList.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function UserNoticeList() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);

  const [pageInfo, setPageInfo] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios.get("http://localhost:8001/triptype/notice", {
      params: { page },
      withCredentials: true
    })
    .then(res => {
      setNotices(res.data.list);
      setPageInfo(res.data.pageInfo);
    })
    .catch(console.error);
  }, [page]);

  return (
    <div className="notice-page">
      <h2 className="notice-page-title">공지사항</h2>

      <div className="notice-card-list">
        {notices.map(n => (
          <div
            key={n.noticeId} // 백엔드 Notice VO 기준으로 key 설정
            className={`notice-card ${n.noticeIsImportant === "Y" ? "important" : ""}`}
            onClick={() => navigate(`/notice/${n.noticeId}`)}
          >
            <div className="notice-card-left">
              {n.noticeIsImportant === "Y" && <span className="badge">중요</span>}
              <span className="notice-card-title">{n.noticeTitle}</span>
            </div>
            <span className="notice-card-date">{n.noticeCreatedAt?.split("T")[0]}</span>
          </div>
        ))}
      </div>

      {pageInfo && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            이전
          </button>

          {Array.from(
            { length: pageInfo.endPage - pageInfo.startPage + 1 },
            (_, i) => pageInfo.startPage + i
          ).map(p => (
            <button
              key={p}
              className={p === page ? "active" : ""}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}

          <button
            disabled={page === pageInfo.maxPage}
            onClick={() => setPage(page + 1)}
          >
            다음
          </button>
        </div>
      )}


    </div>
  );
}

export default UserNoticeList;

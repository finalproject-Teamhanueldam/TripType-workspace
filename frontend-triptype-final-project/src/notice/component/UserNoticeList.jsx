import "../css/UserNoticeList.css";
import { useNavigate } from "react-router-dom";

function UserNoticeList() {
  const navigate = useNavigate();

  const notices = [
    { id: 1, title: "항공권 시스템 점검 안내", date: "2025-01-01", important: true },
    { id: 2, title: "국제선 수하물 규정 변경", date: "2025-01-05", important: false }
  ];

  return (
    <div className="notice-page">
      <h2 className="notice-page-title">공지사항</h2>

      <div className="notice-card-list">
        {notices.map(n => (
          <div
            key={n.id}
            className={`notice-card ${n.important ? "important" : ""}`}
            onClick={() => navigate(`/notice/${n.id}`)}
          >
            <div className="notice-card-left">
              {n.important && <span className="badge">중요</span>}
              <span className="notice-card-title">{n.title}</span>
            </div>
            <span className="notice-card-date">{n.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserNoticeList;

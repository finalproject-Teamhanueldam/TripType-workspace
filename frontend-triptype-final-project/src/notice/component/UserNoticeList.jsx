import "../css/UserNoticeList.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function UserNoticeList() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    // Spring Boot 백엔드에서 데이터 가져오기
    axios.get("http://localhost:8001/triptype/notice", { withCredentials: true })
      .then(res => {
        setNotices(res.data); // 백엔드에서 받은 JSON을 상태로 저장
        console.log(res.data)
      })
      .catch(err => console.error(err));
  }, []);

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
    </div>
  );
}

export default UserNoticeList;

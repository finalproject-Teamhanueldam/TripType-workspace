import "../css/UserNoticeDetail.css";
import NoticeComment from "./NoticeComment";
import { useNavigate, useParams } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";

function UserNoticeDetail() {
  const navigate = useNavigate();
  const { noticeId } = useParams();

  const [notice, setNotice] = useState(null);

  useEffect(() => {
  axios.get(`http://localhost:8001/triptype/notice/${noticeId}`)
    .then(res => {
      console.log("공지 상세:", res.data);
      setNotice(res.data);
    })
    .catch(err => console.error(err));
  }, [noticeId]);

  if (!notice) return <div>로딩중...</div>;

  return (
    <div className="notice-detail-page">

      <div className="notice-title-row">
        <h2 className="notice-detail-title">
          {notice.noticeTitle}
        </h2>

        <button className="notice-back-btn icon" onClick={() => navigate(-1)}>
          <FaAngleLeft /> 목록으로
        </button>
      </div>

      <div className="notice-meta">
        {notice.noticeCreatedAt} · 조회수 {notice.noticeViews}
      </div>

      <div className="notice-content-box">
        {notice.noticeContent}
      </div>

      {/* 첨부파일 */}
      {notice.attachmentList && notice.attachmentList.length > 0 && (
        <div className="notice-attachment-box">
          <h4>첨부파일</h4>
          <ul>
            {notice.attachmentList.map(file => (
              <li key={file.noticeAttachmentId}>
                <a
                  href={`http://localhost:8001${file.noticeAttachmentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.noticeAttachmentName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 댓글 */}
      <NoticeComment noticeId={noticeId} />
    </div>
  );
}

export default UserNoticeDetail;

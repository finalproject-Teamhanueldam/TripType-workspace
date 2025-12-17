import "../css/AdminCommon.css";
import "../css/AdminNoticeDetail.css";

const AdminNoticeDetail = () => {
  return (
    <div className="admin-page">
      <h2 className="page-title">공지사항 상세</h2>

      {/* ===== 공지 상세 / 수정 ===== */}
      <div className="detail-card">
        <input
          type="text"
          className="detail-title-input"
          placeholder="공지 제목"
          value="공지 제목 예시"
        />

        <textarea
          className="detail-content"
          placeholder="공지 내용"
          value="공지 내용 예시"
        />

        <div className="detail-meta">
          <span>조회수: 123</span>
          <span>작성일: 2025-01-01</span>
          <span>중요공지: Y</span>
        </div>

        <div className="detail-actions">
          <button className="btn btn-primary">수정</button>
          <button className="btn btn-danger">삭제</button>
          <button className="btn btn-outline">목록</button>
        </div>
      </div>

      {/* ===== 댓글 관리 ===== */}
      <div className="detail-card">
        <h3 className="sub-title">댓글 관리</h3>

        <div className="comment-table">
          <div className="comment-row header">
            <div>
              <input type="checkbox" />
            </div>
            <div>댓글 내용</div>
            <div>작성자</div>
            <div>작성일</div>
            <div>관리</div>
          </div>

          <div className="comment-row">
            <div>
              <input type="checkbox" />
            </div>
            <div className="comment-text">
              댓글 내용 예시입니다.
            </div>
            <div>user01</div>
            <div>2025-01-02</div>
            <div>
              <button className="btn btn-ghost">삭제</button>
            </div>
          </div>

          <div className="comment-row">
            <div>
              <input type="checkbox" />
            </div>
            <div className="comment-text">
              두 번째 댓글입니다.
            </div>
            <div>user02</div>
            <div>2025-01-03</div>
            <div>
              <button className="btn btn-ghost">삭제</button>
            </div>
          </div>
        </div>

        <div className="comment-actions">
          <button className="btn btn-danger">선택 삭제</button>
        </div>
      </div>
    </div>
  );
};

export default AdminNoticeDetail;

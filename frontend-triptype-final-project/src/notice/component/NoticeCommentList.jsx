import "../css/noticeComment.css";

function NoticeCommentList() {
  const comments = [
    { id: 1, writer: "user01", text: "확인했습니다.", date: "2025-01-02" }
  ];

  return (
    <div className="comment-section">
      <h3 className="comment-title">댓글 {comments.length}</h3>

      {comments.map(c => (
        <div key={c.id} className="comment-item">
          <div className="comment-writer">{c.writer}</div>
          <div className="comment-text">{c.text}</div>
          <div className="comment-date">{c.date}</div>
        </div>
      ))}
    </div>
  );
}

export default NoticeCommentList;

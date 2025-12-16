import "../css/noticeComment.css";

function NoticeCommentForm() {
  return (
    <div className="comment-form">
      <textarea placeholder="댓글을 입력하세요" />
      <button>등록</button>
    </div>
  );
}

export default NoticeCommentForm;

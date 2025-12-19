import "../css/NoticeComment.css";
import { useState } from "react";
import { FaPen, FaTrashAlt } from "react-icons/fa";


function NoticeCommentList() {
  const currentUser = "user01";

  const [comments, setComments] = useState([
    { id: 1, writer: "user01", text: "확인했습니다.", date: "2025-01-02" },
    { id: 2, writer: "user02", text: "확인했습니다.", date: "2025-01-02" },
    { id: 3, writer: "user03", text: "확인했습니다.", date: "2025-01-02" },
    { id: 4, writer: "user04", text: "확인했습니다.", date: "2025-01-02" },
    { id: 5, writer: "user05", text: "확인했습니다.", date: "2025-01-02" }
  ]);

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const handleEdit = (comment) => {
    setEditId(comment.id);
    setEditText(comment.text);
  };

  const handleEditSave = (id) => {
    setComments(
      comments.map(c =>
        c.id === id ? { ...c, text: editText } : c
      )
    );
    setEditId(null);
  };

  const handleDelete = (id) => {
    setComments(comments.filter(c => c.id !== id));
  };

  return (
    <div className="comment-section">
      <h3 className="comment-title">댓글 {comments.length}</h3>

      <div className="comment-form">
        <textarea placeholder="댓글을 입력하세요" />
        <button>등록</button>
      </div>

      {comments.map(c => (
        <div key={c.id} className="comment-item">
          <div className="comment-header">
            <div className="comment-writer">
              <span className="comment-username">@{c.writer}</span>
              <span className="comment-date">{c.date}</span>
            </div>

            {c.writer === currentUser && (
              <div className="comment-actions">
                <button onClick={() => handleEdit(c)} title="수정">
                  <FaPen />
                </button>
                <button onClick={() => handleDelete(c.id)} title="삭제">
                  <FaTrashAlt />
                </button>
              </div>
            )}
          </div>


          {editId === c.id ? (
            <div className="comment-edit">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <div className="edit-actions right">
                <button onClick={() => handleEditSave(c.id)}>저장</button>
                <button onClick={() => setEditId(null)}>취소</button>
              </div>
            </div>
          ) : (
            <div className="comment-text">{c.text}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default NoticeCommentList;

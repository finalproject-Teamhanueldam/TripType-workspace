import "../css/NoticeComment.css";
import { useEffect, useState } from "react";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import axios from "axios";

function NoticeComment({ noticeId }) {
  const currentMemberNo = 1; // 로그인 정보로 교체 가능

  const [comments, setComments] = useState([]);
  const [newText, setNewText] = useState("");

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // 댓글 목록 조회
  const fetchComments = () => {
    axios
      .get(`http://localhost:8001/triptype/notice/${noticeId}/comment`)
      .then(res => setComments(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchComments();
  }, [noticeId]);

  // 댓글 등록
  const handleCreate = () => {
    if (!newText.trim()) return;

    axios
      .post(`http://localhost:8001/triptype/notice/${noticeId}/comment`, {
        noticeCommentContent: newText,
        memberNo: currentMemberNo
      })
      .then(() => {
        setNewText("");
        fetchComments();
      })
      .catch(err => console.error(err));
  };

  // 댓글 수정
  const handleEdit = (id) => {
    if (!editText.trim()) return;

    axios
      .put(`http://localhost:8001/triptype/notice/${noticeId}/comment/${id}`, {
        noticeCommentContent: editText
      })
      .then(() => {
        setEditId(null);
        setEditText("");
        fetchComments();
      })
      .catch(err => console.error(err));
  };

  // 댓글 삭제
  const handleDelete = (id) => {
  axios.delete(`http://localhost:8001/notice/${noticeId}/comment/${id}`, {
    params: { memberNo: currentMemberNo },
    withCredentials: true // 서버가 allowCredentials(true)라면 필요
  })
  .then(() => fetchComments())
  .catch(err => console.error(err));
  };



  return (
    <div className="comment-section">
      <h3 className="comment-title">댓글 {comments.length}</h3>

      {/* 댓글 작성 폼 */}
      <div className="comment-form">
        <textarea
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button onClick={handleCreate}>등록</button>
      </div>

      {/* 댓글 리스트 */}
      {comments.map(c => (
        <div key={c.noticeCommentId} className="comment-item">
          <div className="comment-header">
            <div className="comment-writer">
              <span className="comment-username">@회원번호 {c.memberNo}</span>
              <span className="comment-date">{c.noticeCommentCreatedAt}</span>
            </div>

            {/* 본인 댓글만 수정/삭제 버튼 표시 */}
            {c.memberNo === currentMemberNo && (
              <div className="comment-actions">
                {editId === c.noticeCommentId ? (
                  <div className="comment-edit">
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                    />
                    <div className="edit-actions right">
                      <button onClick={() => handleEdit(c.noticeCommentId)}>완료</button>
                      <button onClick={() => setEditId(null)}>취소</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button onClick={() => {
                      setEditId(c.noticeCommentId);
                      setEditText(c.noticeCommentContent);
                    }}>
                      <FaPen />
                    </button>
                    <button onClick={() => handleDelete(c.noticeCommentId)}>
                      <FaTrashAlt />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="comment-text">{c.noticeCommentContent}</div>
        </div>
      ))}
    </div>
  );
}

export default NoticeComment;

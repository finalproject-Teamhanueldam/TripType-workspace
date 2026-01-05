import "../css/NoticeComment.css";
import { useEffect, useState } from "react";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import axios from "axios";

function NoticeComment({ noticeId }) {

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // jwt
  const authHeader = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  };

  const [loading, setLoading] = useState(false);
  
  const [comments, setComments] = useState([]);
  const [newText, setNewText] = useState("");

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // 페이징 관련
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // 한 페이지당 댓글 수
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // 페이징
  const fetchComments = async (page = 1) => {
  if (!noticeId) return;

  const startRow = (page - 1) * pageSize + 1;
  const endRow = page * pageSize;

  try {
      const res = await axios.get(
    `${API_BASE_URL}/notice/${noticeId}/comment`,
    {
      params: { startRow, endRow },
      ...authHeader
    }
  );

    setComments(res.data.comments);
    setTotalCount(res.data.totalCount);
  } catch (err) {
    console.error(err);
  }
};


  useEffect(() => {
    fetchComments(currentPage);
  }, [noticeId, currentPage]);

  // 댓글 등록
  const handleCreate = async () => {
    if (!newText.trim()) return;

    try {
    await axios.post(
      `${API_BASE_URL}/notice/${noticeId}/comment`,
      { noticeCommentContent: newText },
      authHeader
    );
      setNewText("");
      fetchComments(currentPage);
    } catch (err) {
      console.error(err);
    }
  };

  // 댓글 수정
  const handleEdit = async (id) => {
    if (!editText.trim()) return;

    try {
      await axios.put(
        `${API_BASE_URL}/notice/${noticeId}/comment/${id}`,
        { noticeCommentId: id,
          noticeCommentContent: editText },
        authHeader
      );
      setEditId(null);
      setEditText("");
      fetchComments(currentPage);
    } catch (err) {
      console.error(err);
    }
  };

  // 댓글 삭제
  const handleDelete = async (id) => {
    if (loading) return;
    setLoading(true);

    try {
      await axios.delete(
        `${API_BASE_URL}/notice/${noticeId}/comment/${id}`,
        authHeader
      );

      // 삭제 후 edit 모드 종료
      if (editId === id) {
        setEditId(null);
        setEditText("");
      }

      fetchComments(currentPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="comment-section">
      <h3 className="comment-title">댓글 {totalCount}</h3>

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
      {[...comments]
        .sort((a, b) => new Date(b.noticeCommentCreatedAt) - new Date(a.noticeCommentCreatedAt))
        .map(c => (
          <div key={c.noticeCommentId} className="comment-item">
            <div className="comment-header">
              <div className="comment-writer">
                <span className="comment-username">@회원번호 {c.memberNo}</span>
                <span className="comment-date">{c.noticeCommentCreatedAt}</span>
              </div>

              {/* 본인 댓글만 수정/삭제 */}
              {c.mine && (
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
                      <button
                        onClick={() => {
                          setEditId(c.noticeCommentId);
                          setEditText(c.noticeCommentContent);
                        }}
                      >
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

      {/* 페이징 버튼 */}
      <div className="pagination">
        {/* 이전 버튼 */}
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          이전
        </button>

        {/* 페이지 번호 */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            className={`page-btn ${page === currentPage ? "active" : ""}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}

        {/* 다음 버튼 */}
        <button
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          다음
        </button>
      </div>

    </div>
  );
}

export default NoticeComment;

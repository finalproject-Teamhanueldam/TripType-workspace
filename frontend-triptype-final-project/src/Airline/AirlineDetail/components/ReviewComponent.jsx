import { FaTrashAlt, FaPen } from "react-icons/fa";
import "../css/ReviewComponent.css";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const ReviewComponent = ({ outbound, inbound, segments, tripType }) => {

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 디버깅용 로그
  console.log('ReviewComponent Props:', { outbound, inbound, segments });
  // flightOfferId 추출 로직: outbound에 데이터가 있으므로 우선순위 조정
  const flightOfferId = useMemo(() => {
    // 1) outbound에 ID가 있는 경우 (가장 먼저 확인)
    if (outbound?.flightOfferId) return outbound.flightOfferId;
    // 2) segments 배열이 있는 경우 첫 세그먼트 기준
    if (Array.isArray(segments) && segments.length > 0) {
      return segments[0]?.flightOfferId || null;
    }
    // 3) inbound 기준
    if (inbound?.flightOfferId) return inbound.flightOfferId;
    return null;
  }, [segments, outbound, inbound]);
  // state 정의
  const [text, setText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loginMemberNo, setLoginMemberNo] = useState(null);
  const [editingReviewNo, setEditingReviewNo] = useState(null);
  const [editingText, setEditingText] = useState("");
  // 로그인된 회원 정보 가져오기
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      (async () => {
        try {
          const { jwtDecode } = await import("jwt-decode");
          const payload = jwtDecode(token);
          setLoginMemberNo(payload.sub);
        } catch (e) {
          console.error("JWT Decode Error:", e);
        }
      })();
    }
  }, []);
  // 리뷰 조회 함수
  const fetchReviews = async () => {
    if (!flightOfferId) {
      setReviews([]);
      return;
    }
    try {
      const response = await axios.get(
        `${API_BASE_URL}/airline/review/select`,
        { params: { flightOfferId } }
      );
      setReviews(response.data);
    } catch (error) {
      console.error("리뷰 조회 실패:", error);
    }
  };
  // ID가 결정되면 리뷰 로드
  useEffect(() => {
    fetchReviews();
  }, [flightOfferId]);
  // 리뷰 작성
  const uploadReview = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.info("먼저 로그인을 진행해주세요.");
      return;
    }
    if (!flightOfferId) {
      toast.info("항공권 정보를 확인할 수 없습니다.");
      return;
    }
    if (!text.trim()) {
      toast.info("리뷰 내용을 입력해주세요");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/airline/review`,
        { reviewContent: text, flightOfferId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText("");
      fetchReviews();
      toast.success("리뷰가 등록되었습니다.");
    } catch (error) {
      console.error(error);
      toast.error("리뷰 등록 중 오류가 발생했습니다.");
    }
  };
  // 리뷰 수정 시작
  const startEditing = (review) => {
    setEditingReviewNo(review.reviewNo);
    setEditingText(review.reviewContent);
  };
  // 수정 완료
  const confirmEdit = async (reviewNo) => {
    if (!editingText.trim()) {
      toast.info("수정 내용을 입력해주세요.");
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/airline/review/update`,
        { reviewNo, reviewContent: editingText, flightOfferId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.info(response.data);
      setEditingReviewNo(null);
      setEditingText("");
      fetchReviews();
    } catch (error) {
      console.error(error);
      toast.error("수정 중 오류가 발생했습니다.");
    }
  };
  const cancelEdit = () => {
    setEditingReviewNo(null);
    setEditingText("");
  };
  // 리뷰 삭제
  const deleteReview = async (reviewNo) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/airline/review/delete`,
        { reviewNo, flightOfferId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.info(response.data);
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };
  const getInitial = (name) => (!name ? "?" : name.charAt(0).toUpperCase());
  return (
    <div className="review-container">
      <div className="review-header">
        <span className="review-header-title">자유 댓글</span>
        <span className="review-header-count">{reviews.length}</span>
      </div>
      {tripType === "MULTI" && (
        <div style={{ fontSize: "12px", color: "#777", marginBottom: "8px" }}>
          * 다구간 항공권은 전체 여정(offer) 기준으로 댓글이 공유됩니다.
        </div>
      )}
      <div className="write-review-section">
        <div className="write-input-area">
          <textarea
            placeholder="이 항공편에 대한 자유 댓글을 달아주세요..."
            rows="4"
            className="review-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="register-button" onClick={uploadReview}>
            등록하기
          </button>
        </div>
      </div>
      <div className="review-list">
        {reviews.map((review) => (
          <div key={review.reviewNo} className="review-item">
            <div className="review-user-info">
              <div className="user-initial-circle">{getInitial(review.memberName)}</div>
              <div className="user-details">
                <span className="user-name">{review.memberName}</span>
                <span className="review-date">
                  {review.reviewCreateDate ? new Date(review.reviewCreateDate).toLocaleDateString() : ""}
                </span>
              </div>
              {loginMemberNo && String(loginMemberNo) === String(review.memberNo) && (
                <div className="review-actions">
                  {editingReviewNo === review.reviewNo ? (
                    <>
                      <button className="edit-confirm-button" onClick={() => confirmEdit(review.reviewNo)}>완료</button>
                      <button className="edit-cancel-button" onClick={cancelEdit}>취소</button>
                    </>
                  ) : (
                    <>
                      <FaPen className="action-icon edit-icon" onClick={() => startEditing(review)} />
                      <FaTrashAlt className="action-icon delete-icon" onClick={() => deleteReview(review.reviewNo)} />
                    </>
                  )}
                </div>
              )}
            </div>
            {editingReviewNo === review.reviewNo ? (
              <textarea
                className="review-textarea edit-textarea"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
              />
            ) : (
              <p className="review-text">{review.reviewContent}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ReviewComponent;
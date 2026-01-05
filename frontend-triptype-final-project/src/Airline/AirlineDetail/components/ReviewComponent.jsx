import { FaTrashAlt, FaPen } from "react-icons/fa";
import "../css/ReviewComponent.css";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ReviewComponent = ({ outbound, inbound, segments, tripType }) => {
  // ✅ flightOfferId 안전 추출 (MULTI/ONEWAY/ROUND 모두 대응)
  const flightOfferId = useMemo(() => {
    // 1) segments가 있으면 첫 세그먼트 기준
    if (Array.isArray(segments) && segments.length > 0) {
      return segments[0]?.flightOfferId || null;
    }
    // 2) outbound 기준
    if (outbound?.flightOfferId) return outbound.flightOfferId;
    // 3) inbound 기준(왕복인데 outbound가 없을 때)
    if (inbound?.flightOfferId) return inbound.flightOfferId;
    return null;
  }, [segments, outbound, inbound]);

  // textArea text
  const [text, setText] = useState("");

  // 리뷰 묶음
  const [reviews, setReviews] = useState([]);

  // 회원 번호
  const [loginMemberNo, setLoginMemberNo] = useState(null);

  // reviewNo
  const [editingReviewNo, setEditingReviewNo] = useState(null);

  // edit-reviewContent
  const [editingText, setEditingText] = useState("");

  // 리뷰 수정 시작
  const startEditing = (review) => {
    setEditingReviewNo(review.reviewNo);
    setEditingText(review.reviewContent);
  };

  // 수정 취소
  const cancelEdit = () => {
    setEditingReviewNo(null);
    setEditingText("");
  };

  // 로그인된 회원 정보 가져오기
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      (async () => {
        const { jwtDecode } = await import("jwt-decode");
        const payload = jwtDecode(token);
        setLoginMemberNo(payload.sub);
      })();
    }
  }, []);

  // 리뷰 조회
  const fetchReviews = async () => {
    try {
      if (!flightOfferId) {
        setReviews([]);
        return;
      }

      const response = await axios.get(
        "http://localhost:8001/triptype/airline/review/select",
        { params: { flightOfferId } }
      );
      setReviews(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightOfferId]);

  // 리뷰 작성
  const uploadReview = async () => {
    const token = localStorage.getItem("accessToken");

    if (token == null) {
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
        "http://localhost:8001/triptype/airline/review",
        { reviewContent: text, flightOfferId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setText("");
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  // 리뷰 수정
  const confirmEdit = async (reviewNo) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (token == null) {
        toast.info("먼저 로그인을 진행해주세요.");
        return;
      }

      if (!flightOfferId) {
        toast.info("항공권 정보를 확인할 수 없습니다.");
        return;
      }

      if (!editingText.trim()) {
        toast.info("수정 내용을 입력해주세요.");
        return;
      }

      const response = await axios({
        url: "http://localhost:8001/triptype/airline/review/update",
        method: "post",
        headers: { Authorization: `Bearer ${token}` },
        data: {
          reviewNo,
          reviewContent: editingText,
          flightOfferId,
        },
      });

      toast.info(response.data);
      setEditingReviewNo(null);
      setEditingText("");
      fetchReviews();
    } catch (error) {
      console.error(error);
      toast.error("수정 중 오류가 발생했습니다.");
    }
  };

  // 리뷰 삭제
  const deleteReview = async (reviewNo) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (token == null) {
        toast.info("먼저 로그인을 진행해주세요.");
        return;
      }

      if (!flightOfferId) {
        toast.info("항공권 정보를 확인할 수 없습니다.");
        return;
      }

      const response = await axios({
        url: "http://localhost:8001/triptype/airline/review/delete",
        method: "post",
        headers: { Authorization: `Bearer ${token}` },
        data: {
          reviewNo,
          flightOfferId,
        },
      });

      toast.info(response.data);
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  // 이니셜
  const getInitial = (name) => (!name ? "?" : name.charAt(0).toUpperCase());

  return (
    <div className="review-container">
      {/* 헤더 */}
      <div className="review-header">
        <span className="review-header-title">자유 댓글</span>
        <span className="review-header-count">{reviews.length}</span>
      </div>

      {/* ✅ (선택) MULTI일 때 안내 문구 */}
      {tripType === "MULTI" && (
        <div style={{ fontSize: "12px", color: "#777", marginBottom: "8px" }}>
          * 다구간 항공권은 전체 여정(offer) 기준으로 댓글이 공유됩니다.
        </div>
      )}

      {/* 리뷰 작성 섹션 */}
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

      {/* 리뷰 목록 */}
      <div className="review-list">
        {reviews.map((review) => (
          <div key={review.reviewNo} className="review-item">
            <div className="review-user-info">
              <div className="user-initial-circle">{getInitial(review.memberName)}</div>

              <div className="user-details">
                <span className="user-name">{review.memberName}</span>
                <span className="review-date">
                  {review.reviewCreateDate
                    ? new Date(review.reviewCreateDate).toLocaleDateString()
                    : ""}
                </span>
              </div>

              {/* 로그인 회원 && 본인 댓글일 경우 수정/삭제 버튼 */}
              {loginMemberNo && String(loginMemberNo) === String(review.memberNo) && (
                <div className="review-actions">
                  {editingReviewNo === review.reviewNo ? (
                    <>
                      <button
                        className="edit-confirm-button"
                        onClick={() => confirmEdit(review.reviewNo)}
                      >
                        완료
                      </button>
                      <button className="edit-cancel-button" onClick={cancelEdit}>
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <FaPen
                        className="action-icon edit-icon"
                        onClick={() => startEditing(review)}
                      />
                      <FaTrashAlt
                        className="action-icon delete-icon"
                        onClick={() => deleteReview(review.reviewNo)}
                      />
                    </>
                  )}
                </div>
              )}
            </div>

            {/* 리뷰 내용 또는 편집 textarea */}
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

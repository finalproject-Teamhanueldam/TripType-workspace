import { FaTrashAlt, FaPen } from 'react-icons/fa';
import "../css/ReviewComponent.css";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReviewComponent = ({ outbound }) => {
  const [text, setText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loginMemberNo, setLoginMemberNo] = useState(null);

  // 로그인된 회원 정보 가져오기
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      (async () => {
        const { jwtDecode } = await import("jwt-decode");
        const payload = jwtDecode(token);
        console.log("JWT payload:", payload);
        setLoginMemberNo(payload.memberNo || payload.id);
      })();
    }
  }, []);

  // 리뷰 조회
  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8001/triptype/airline/review/select",
        { params: { flightOfferId: outbound.flightOfferId } }
      );
      setReviews(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [outbound]);

  // 리뷰 작성
  const uploadReview = async () => {
    if (!text.trim()) {
      toast.info("리뷰 내용을 입력해주세요");
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        "http://localhost:8001/triptype/airline/review",
        { reviewContent: text, flightOfferId: outbound.flightOfferId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText("");
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  // 리뷰 삭제
  const deleteReview = async (reviewNo) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(
        `http://localhost:8001/triptype/airline/review/${reviewNo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  // 이니셜
  const getInitial = (name) => (!name ? "?" : name.charAt(0).toUpperCase());

  return (
    <div className="review-container">
      <div className="review-header">
        <span className="review-header-title">자유 댓글</span>
        <span className="review-header-count">{reviews.length}</span>
      </div>

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
                  {review.reviewCreateDate
                    ? new Date(review.reviewCreateDate).toLocaleDateString()
                    : ""}
                </span>
              </div>

              {/* 로그인 회원 && 본인 댓글일 경우 수정/삭제 버튼 */}
              {loginMemberNo && loginMemberNo === review.memberNo && (
                <div className="review-actions">
                  <FaPen className="action-icon edit-icon" />
                  <FaTrashAlt
                    className="action-icon delete-icon"
                    onClick={() => deleteReview(review.reviewNo)}
                  />
                </div>
              )}
            </div>
            <p className="review-text">{review.reviewContent}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewComponent;

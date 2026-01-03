import { FaTrashAlt, FaPen } from 'react-icons/fa';
import "../css/ReviewComponent.css";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReviewComponent = ({ outbound }) => {

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

  reviews.map((item) => {
    console.log(item);
  });

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
        console.log("JWT payload:", payload);
        setLoginMemberNo(payload.sub);
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
    const token = localStorage.getItem("accessToken");

    if(token == null){
       toast.info("먼저 로그인을 진행해주세요.");
       return;
    }

    if (!text.trim()) {
      toast.info("리뷰 내용을 입력해주세요");
      return;
    }
    try {
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

  // 리뷰 수정
  const confirmEdit = async (reviewNo) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios({
        url: "http://localhost:8001/triptype/airline/review/update",
        method: "post",
        headers: { Authorization: `Bearer ${token}` },
        data: { 
          reviewNo: reviewNo, 
          reviewContent: editingText,
          flightOfferId: outbound.flightOfferId
        }
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
      const url ="http://localhost:8001/triptype/airline/review/delete";
      const method="post";

      const response = await axios({
        url,
        method,
        headers : { Authorization: `Bearer ${token}` },
        data: { 
          reviewNo: reviewNo, 
          flightOfferId: outbound.flightOfferId
        }
      })

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
              {loginMemberNo && loginMemberNo == review.memberNo && (
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

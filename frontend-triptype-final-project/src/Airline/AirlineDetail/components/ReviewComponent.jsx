import { FaStar, FaRegStar, FaEllipsisV, FaTrashAlt, FaPen } from 'react-icons/fa';
import "../css/ReviewComponent.css";
import { useState } from 'react';
import axios from 'axios';

// 별점 렌더링 함수
// const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//         if (i <= rating) {
//             stars.push(<FaStar key={i} className="star-filled" />);
//         } else {
//             stars.push(<FaRegStar key={i} className="star-empty" />);
//         }
//     }
//     return <div className="rating-stars">{stars}</div>;
// };

// 리뷰 데이터 구조를 미리 정의 (디자인 목적으로만 사용하며, 실제 데이터는 넣지 않습니다.)
const dummyReviews = [
    {
        id: 1,
        initial: 'T',
        user: 'Traveler_Kim',
        date: '2023-10-15',
        rating: 5,
        text: '좌석이 매우 편안하고 승무원분들이 친절했습니다. 기내식도 맛있었어요!',
        canEdit: false
    },
    {
        id: 2,
        initial: 'S',
        user: 'SkyWalker',
        date: '2023-10-20',
        rating: 4,
        text: '가격 대비 무난했지만, 출발이 30분 지연되어 아쉬웠습니다.',
        canEdit: true // 편집/삭제 아이콘을 보여주기 위한 설정
    },
    {
        id: 3,
        initial: 'H',
        user: 'HappyFly',
        date: '2023-11-01',
        rating: 3,
        text: '좌석이라 편하게 왔습니다. 영화 종류가 더 많았으면 좋겠어요.',
        canEdit: false
    },
];


const ReviewComponent = ({ outbound, inbound }) => {
    // // 임시 데이터의 평균 별점 계산 (4.0)
    // const averageRating = 4.0;
    // const filledStarsCount = Math.round(averageRating);

    const [ text, setText ] = useState("");

    const memberId = localStorage.getItem("memberId");

    console.log(outbound, inbound);


    // 리뷰 작성 함수
    const upload = () => {
        const uploadReview = async () => {
            try {
                const url = "http://localhost:8001/triptype/airline/review";
                const method = "post";

                const response = await axios({
                   url,
                   method,
                   data : { reviewContent : text,  memberId : memberId, flightOfferId : outbound.flightOfferId } 
                });

                console.log("등록 완료", response);
            }
            catch(error) {
                console.log(error);
            }
        };
        uploadReview();
    };

    const onChange = (value) => {
        setText(value);
    };

    return (
        <div className="review-container">
            {/* 헤더 섹션 */}
            <div className="review-header">
                <span className="review-header-title">자유 댓글</span>
                <span className="review-header-count">3</span>
                {/* <div className="average-rating">
                    <span className="rating-score">{averageRating.toFixed(1)}</span>
                    <span className="total-score">/ 5.0</span>
                    <div className="header-stars">
                        {renderStars(filledStarsCount)}
                    </div>
                </div> */}
            </div>

            {/* 리뷰 작성 섹션 */}
            <div className="write-review-section">
                {/* <div className="write-rating-area">
                    {renderStars(5)}
                </div> */}
                <div className="write-input-area">
                    <textarea
                        placeholder="이 항공편에 대한 자유 댓글을 달아주세요..."
                        rows="4"
                        className="review-textarea"
                        onChange={(e) => onChange(e.target.value)}
                    ></textarea>
                    <button className="register-button" onClick={() => upload()}>등록하기</button>
                </div>
            </div>

            {/* 리뷰 목록 섹션 */}
            <div className="review-list">
                {dummyReviews.map((review) => (
                    <div key={review.id} className="review-item">
                        <div className="review-user-info">
                            <div className={`user-initial-circle user-initial-${review.initial}`}>
                                {review.initial}
                            </div>
                            <div className="user-details">
                                {/* 유저명 */}
                                <span className="user-name">{review.user}</span>
                                
                                {/* 작성일 */}
                                <span className="review-date">{review.date}</span>
                                {/* <div className="review-stars-row">
                                    {renderStars(review.rating)}
                                </div> */}
                            </div>
                            {review.canEdit && (
                                <div className="review-actions">
                                    {/* 작성 아이콘 */}
                                    <FaPen className="action-icon edit-icon"/>

                                    {/* 삭제 아이콘 */}
                                    <FaTrashAlt className="action-icon delete-icon" />
                                </div>
                            )}
                        </div>
                        <p className="review-text">{review.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewComponent;
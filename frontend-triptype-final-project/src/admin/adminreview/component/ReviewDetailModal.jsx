import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../css/ReviewDetailModal.css";

const formatDateOnly = (dateTime) => {
  if (!dateTime) return '-';
  return dateTime.includes('T')
    ? dateTime.split('T')[0]
    : dateTime.split(' ')[0];
};

const ReviewDetailModal = ({ airline, onClose, onRefresh }) => {

  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState('Y');
  const [memberNo, setMemberNo] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, airline?.airlineId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/review/airline/${airline.airlineId}`,
        { params: { status } }
      );

      const sorted = [...response.data].sort(
        (a, b) => new Date(b.reviewCreateDate) - new Date(a.reviewCreateDate)
      );

      setReviews(sorted);
    } catch (error) {
      console.error("댓글 상세 조회 실패", error);
    }
  };

  const filteredReviews = reviews.filter(r =>
    memberNo ? String(r.memberNo).includes(memberNo) : true
  );

  const handleStatusChange = async (reviewId) => {
    if (!window.confirm("댓글 상태를 변경하시겠습니까?")) return;

    try {
      await axios.post(
        `${API_BASE_URL}/admin/review/status`,
        { reviewId }
      );
      await fetchReviews();
      onRefresh?.();
    } catch (error) {
      console.error("댓글 상태 변경 실패", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{airline.airlineName} 댓글 상세내역</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="modal-filter-row">
            <div className="status-tab-group">
              <button
                className={`tab-btn ${status === 'Y' ? 'active' : ''}`}
                onClick={() => setStatus('Y')}
              >
                정상 댓글
              </button>
              <button
                className={`tab-btn ${status === 'N' ? 'active-del' : ''}`}
                onClick={() => setStatus('N')}
              >
                삭제된 댓글
              </button>
            </div>

            <input
              type="text"
              placeholder="회원번호 검색"
              value={memberNo}
              onChange={(e) => setMemberNo(e.target.value)}
              className="admin-review-search-input"
            />
          </div>

          <div className="detail-table-wrap">
            <table className="detail-table">
              <colgroup>
                <col style={{ width: "100px" }} />
                <col />
                <col style={{ width: "100px" }} />
                <col style={{ width: "200px" }} />
                <col style={{ width: "100px" }} />
              </colgroup>

              <thead>
                <tr>
                  <th>회원번호</th>
                  <th>댓글내용</th>
                  {/* <th>평점</th> */}
                  <th>작성/수정일</th>
                  <th>관리</th>
                </tr>
              </thead>

              <tbody>
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-cell">
                      표시할 댓글이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map(rev => (
                    <tr key={rev.reviewNo}>
                      <td>{rev.memberNo}</td>

                      <td className="content-cell">
                        {rev.reviewContent}
                      </td>

                      {/* <td className="rating-cell">
                        ★ {rev.reviewRating}
                      </td> */}
                      
                      <td className="date-cell">
                        <div className="date-block">
                          <div className="date-main">
                            {formatDateOnly(rev.reviewCreateDate)}
                          </div>

                          {rev.reviewModifyDate && (
                            <div className="date-modified">
                              {formatDateOnly(rev.reviewModifyDate)}
                            </div>
                          )}
                        </div>
                      </td>

                      <td>
                        {rev.reviewStatus === 'Y' ? (
                          <button
                            className="blind-btn"
                            onClick={() => handleStatusChange(rev.reviewNo)}
                            type="button"
                          >
                            블라인드
                          </button>
                        ) : (
                          <button
                            className="restore-btn"
                            onClick={() => handleStatusChange(rev.reviewNo)}
                            type="button"
                          >
                            복구
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReviewDetailModal;

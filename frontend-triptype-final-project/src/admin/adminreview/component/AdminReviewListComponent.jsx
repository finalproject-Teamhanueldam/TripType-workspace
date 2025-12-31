import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/AdminReviewList.css";

const AdminAirlineReviewListComponent = () => {
  // 항공사 목록 목데이터
  
  const [summaries, setSummaries] = useState([]);;
  const [filterAirline, setFilterAirline] = useState('');
  const [selectedAirline, setSelectedAirline] = useState(null);
 

  useEffect(() => {
    const selectAirlineReviews = async () => {
      try {
        const url = "http://localhost:8001/triptype/admin/review/airlineReviews";
        const response = await axios.get(url);

        setSummaries(response.data);

      }
      catch (error) {

        console.error("항공사 리뷰 데이터 로드 실패", error);
      
      } 

    };

    selectAirlineReviews();

  }, []);


  // 검색 필터링
  const filteredSummaries = summaries.filter(s => 
    s.airlineName.toLowerCase().includes(filterAirline.toLowerCase())
  );

  return (
    <div className="admin-review-wrap">
      <div className="admin-review-main-area">
        <h2 className="admin-review-main-title">항공사 리뷰 관리</h2>

        <div className="admin-review-search">
          <input 
            className="admin-review-search-input" 
            placeholder="항공사 명 검색 " 
            onChange={(e) => setFilterAirline(e.target.value)}
          />
          <button className="admin-review-search-btn" type="button"> 검색 </button>
        </div>

        {/* 3열 리스트 목록 */}
        <div className="admin-review-list-grid">
          {filteredSummaries.map((item, idx) => (
            <div 
              className="admin-review-card" 
              key={idx}
              onClick={() => setSelectedAirline(item)}
            >

              <div className="card-airline-name">{item.airlineName}</div>
              <div className="card-info">
                <span className="card-rating">★ {Number(item.avgRating || 0).toFixed(1)}</span>
                <span className="card-count">리뷰 {Number(item.reviewCount || 0).toLocaleString()}건</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 상세 조회 모달 */}
      {selectedAirline && (
        <ReviewDetailModal 
          airline={selectedAirline} 
          onClose={() => setSelectedAirline(null)} 
        />
      )}
    </div>
  );
};

// 모달 컴포넌트 (파일 분리 가능)
const ReviewDetailModal = ({ airline, onClose }) => {
  const [status, setStatus] = useState('Y');
  
  const dummyDetails = [
    { id: 1, userNo: 1004, content: "좌석이 넓고 승무원분들이 너무 친절해요!", rating: 5, date: "2023-10-01", update: null, status: 'Y' },
    { id: 2, userNo: 2055, content: "기내식이 조금 짰지만 전반적으로 만족합니다.", rating: 4, date: "2023-10-05", update: "2023-10-06", status: 'Y' },
    { id: 3, userNo: 3021, content: "부적절한 언어 사용으로 인해 블라인드 처리된 리뷰입니다.", rating: 1, date: "2023-09-20", update: null, status: 'N' },
  ].filter(d => d.status === status);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{airline.airlineName} 리뷰 상세내역</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-filter-row">
            <div className="status-tab-group">
              <button className={`tab-btn ${status === 'Y' ? 'active' : ''}`} onClick={() => setStatus('Y')}>정상 리뷰</button>
              <button className={`tab-btn ${status === 'N' ? 'active-del' : ''}`} onClick={() => setStatus('N')}>삭제된 리뷰</button>
            </div>
            <select className="admin-review-sort-select">
              <option>평점 높은순 + 최신순</option>
              <option>오래된순</option>
              <option>평점 낮은순</option>
            </select>
          </div>

          <table className="detail-table">
            <thead>
              <tr>
                <th>회원번호</th>
                <th>리뷰내용</th>
                <th>평점</th>
                <th>작성/수정일</th>
              </tr>
            </thead>
            <tbody>
              {dummyDetails.map(rev => (
                <tr key={rev.id}>
                  <td>{rev.userNo}</td>
                  <td className="content-cell">{rev.content}</td>
                  <td className="rating-cell">★ {rev.rating}</td>
                  <td className="date-cell">
                    {rev.date}
                    {rev.update && <span className="update-text">(수정: {rev.update})</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAirlineReviewListComponent;
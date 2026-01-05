import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/AdminReviewList.css";
import ReviewDetailModal from "./ReviewDetailModal";

const AdminAirlineReviewListComponent = () => {

  const [summaries, setSummaries] = useState([]);
  const [filterAirline, setFilterAirline] = useState('');
  const [selectedAirline, setSelectedAirline] = useState(null);

  const selectAirlineReviews = async () => {
    try {
      const url = "http://localhost:8001/triptype/admin/review/airlineReviews";
      const response = await axios.get(url);
      setSummaries(response.data);
    } catch (error) {
      console.error("항공사 리뷰 데이터 로드 실패", error);
    }
  };

  useEffect(() => {
    selectAirlineReviews();
  }, []);

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
            placeholder="항공사 명 검색"
            value={filterAirline}
            onChange={(e) => setFilterAirline(e.target.value)}
          />
        </div>

        <div className="admin-review-list-grid">
          {filteredSummaries.map((item, idx) => (
            <div
              className="admin-review-card"
              key={idx}
              onClick={() => setSelectedAirline(item)}
            >
              <div className="card-airline-name">{item.airlineName}</div>
              <div className="card-info">
                <span className="card-rating">
                  ★ {Number(item.avgRating || 0).toFixed(1)}
                </span>
                <span className="card-count">
                  리뷰 {Number(item.reviewCount || 0).toLocaleString()}건
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedAirline && (
        <ReviewDetailModal
          airline={selectedAirline}
          onClose={() => setSelectedAirline(null)}
          onRefresh={selectAirlineReviews}
        />
      )}
    </div>
  );
};

export default AdminAirlineReviewListComponent;

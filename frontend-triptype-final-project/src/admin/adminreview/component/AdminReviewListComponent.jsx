import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/AdminReviewList.css";
import ReviewDetailModal from "./ReviewDetailModal";

const AdminAirlineReviewListComponent = () => {

  const AIRLINE_LOGO_MAP = {
    "대한항공": "대한항공.png",
    "아시아나항공": "아시아나.png",
    "제주항공": "제주항공.png",
    "진에어": "진에어.jpg",
    "티웨이항공": "티웨이.png",
    "에어부산": "에어부산.png",
    "에어서울": "에어서울.png",
    "전일본공수": "전일본공수.png",
    "일본항공": "일본항공.png",
    "캐세이퍼시픽": "캐세이퍼시픽.png",
    "싱가포르항공": "싱가폴항공.png",
    "타이항공": "타이항공.png",
    "베트남항공": "베트남항공.png",
    "유나이티드항공": "유나이티드항공.png",
    "델타항공": "델타항공.png",
    "아메리칸항공": "아메리칸항공.jpg",
    "루프트한자": "루프트항공.png",
    "에어프랑스": "에어프랑스.png",
    "KLM 네덜란드항공": "klm항공.png",
    "에미레이트항공": "에미레이트항공.png",
    "트립타임 로고" : "트립타임 로고.png"
  };

  const getAirlineLogo = (airlineName) => {
    if (!airlineName) airlineName = "트립타임 로고";
    const fileName = AIRLINE_LOGO_MAP[airlineName];
    return `/images/${fileName}`;
  }


  const [summaries, setSummaries] = useState([]);
  const [filterAirline, setFilterAirline] = useState('');
  const [selectedAirline, setSelectedAirline] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const selectAirlineReviews = async () => {
    try {
      const url = `${API_BASE_URL}/admin/review/airlineReviews`;
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
        <h2 className="admin-review-main-title">항공사 댓글 관리</h2>

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
              
              <div className="card-airline-name">
                <img
                  src={getAirlineLogo(item.airlineName)}
                  className="airline-logo"
                  alt="항공사 로고"
                />
              
                <span className="card-count">
                  댓글 {Number(item.reviewCount || 0).toLocaleString()}건
                </span>
              </div>
            
              {item.airlineName}

              {/* <div className="card-info">
                <span className="card-rating">
                  ★ {Number(item.avgRating || 0).toFixed(1)}
                </span>
                
              </div> */}
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

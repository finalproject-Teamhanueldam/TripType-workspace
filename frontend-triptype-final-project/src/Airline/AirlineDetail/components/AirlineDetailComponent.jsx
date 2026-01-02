import "../css/TotalCss.css";
import "../css/AirlineDetailComponent.css";
import left from "../images/left.svg";
import TicketPriceChart from "./AlertChartDetailComponent";
import TicketBoxComponent from "../../common/TicketBoxComponent";
import ReviewComponent from "./ReviewComponent";

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const AirlineDetailComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. 데이터 가져오기
  const { inbound, outbound } = location.state || {};

  // 2. tripType 변환 로직 (변수에 담아서 관리)
  // 부모에서 "N" 혹은 "Y"로 넘어오는 값을 화면용 문자열로 변환합니다.
  const displayTripType = outbound?.tripType === "N" ? "ROUND" : "ONEWAY";

  // 찜 State
  const [isWished, setIsWished] = useState(false);

  const changeIsWished = () => {
    setIsWished(!isWished);
  };

  // 데이터 없을 경우 처리
  if (!outbound) return <div>데이터를 찾을 수 없습니다.</div>;

  return (
    <div className="airline-detail-container">
      {/* 상단 헤더 */}
      <div className="ticket-header">
        <img 
          className="ticekt-header-left" 
          src={left} 
          alt="뒤로가기" 
          onClick={() => navigate(-1)} 
          style={{cursor: 'pointer'}}
        />

        <div className="ticekt-header-info">
          <div className="ticekt-header-route">
            {outbound.departCity}({outbound.departAirportCode}) → {outbound.arriveCity}({outbound.arriveAirportCode})
          </div>
          <div className="ticekt-header-date">
            {outbound.departDate.split('T')[0]} · 
            {/* 변환된 displayTripType 사용 */}
            {displayTripType === "ROUND" ? " 왕복" : " 편도"}
          </div>
        </div>

        <button className={`ticekt-header-wish-btn ${isWished ? "active" : ""}`} onClick={changeIsWished}>
          {isWished ? "❤️" : "♡"}
        </button>
      </div>

      <div className="airline-detail-layout">
        <div className="left-section">
          
          {/* 가는 편 (공통) */}
          <p className="section-title">가는 편</p>
          <TicketBoxComponent segment={outbound} showPlus={false} tripType={displayTripType} />

          {/* 왕복(ROUND)일 경우 오는 편 렌더링 */}
          {displayTripType === "ROUND" && inbound && (
            <>
              <p className="section-title">오는 편</p>
              <TicketBoxComponent segment={inbound} showPlus={false} tripType={displayTripType} />
            </>
          )}

          <div className="review-wrapper">
            <ReviewComponent />
          </div>
        </div>

        <aside className="right-section">
          <div className="sticky-box">
            <TicketPriceChart />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AirlineDetailComponent;
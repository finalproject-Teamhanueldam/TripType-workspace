import "../css/TotalCss.css";
import "../css/AirlineDetailComponent.css";
import left from "../images/left.svg";
import TicketPriceChart from "./AlertChartDetailComponent";
import TicketBoxComponent from "../../common/TicketBoxComponent";
import ReviewComponent from "./ReviewComponent";

import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AirlineDetailComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. 데이터 가져오기
  const { inbound, outbound, tripType } = location.state || {};
  const displayTripType = tripType; // ⭐ 그대로 사용


  console.log('outbound : 상세',outbound);


  // 찜 State
  const [isWished, setIsWished] = useState(false);

  const changeIsWished = () => {
    setIsWished(!isWished);
  };

  // 데이터 없을 경우 처리
  if (!outbound) return <div>데이터를 찾을 수 없습니다.</div>;


    useEffect(() => {
    const fetchWishStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const response = await axios.get(
          "http://localhost:8001/triptype/airline/wish/check",
          {
            params: { flightOfferId: outbound.flightOfferId },
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setIsWished(response.data);

      } catch (error) {
        console.error("찜 상태 조회 실패", error);
      }
    };

    fetchWishStatus();
  }, [outbound]);


  const toggleWish = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    if(token == null) {
      toast.info("로그인을 먼저 진행해주세요.");
      return;
    }

    const response = await axios.post(
      "http://localhost:8001/triptype/airline/wish/toggle",
      { flightOfferId: outbound.flightOfferId },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // 서버에서 true / false 반환
    setIsWished(response.data);

    } catch (error) {
      console.error("찜 처리 실패", error);
    }
  };

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

        <button
          className={`ticekt-header-wish-btn ${isWished ? "active" : ""}`}
          onClick={toggleWish}
        >
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
            <ReviewComponent outbound={outbound} inbound={inbound}/>
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
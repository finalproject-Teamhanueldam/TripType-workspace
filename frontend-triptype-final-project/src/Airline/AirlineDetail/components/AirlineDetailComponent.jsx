import "../css/TotalCss.css";
import "../css/AirlineDetailComponent.css";
import left from "../images/left.svg";

import TicketPriceChart from "./AlertChartDetailComponent";
import TicketBoxComponent from "../../common/TicketBoxComponent";
import ReviewComponent from "./ReviewComponent";

import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from "react";


const AirlineDetailComponent = () => {

  const airlineNo = useParams().airlineNo;

  // 구조분해할당
  // const { tripType, segmentCount } = useLocation().state;


  // 찜 State
  const [isWished, setIsWished] = useState(false);

  const tripInfo = {
    tripType: "TRANSIT", // ONE_WAY | ROUND | TRANSIT
    totalPrice: 812000,
    currency: "KRW",

    segments: [
      {
        segmentNo: 1,
        airline: {
          code: "OZ",
          name: "아시아나항공",
          logoUrl: "/airlines/OZ.png",
        },
        flightNumber: "OZ102",
        departure: {
          airportCode: "ICN",
          city: "인천",
          time: "2025-12-16T09:20",
        },
        arrival: {
          airportCode: "NRT",
          city: "도쿄",
          time: "2025-12-16T11:45",
        },
        duration: 145,
        cabinClass: "ECONOMY",
      },
      {
        segmentNo: 2,
        airline: {
          code: "JL",
          name: "일본항공",
          logoUrl: "/airlines/JL.png",
        },
        flightNumber: "JL742",
        departure: {
          airportCode: "NRT",
          city: "도쿄",
          time: "2025-12-16T13:10",
        },
        arrival: {
          airportCode: "BKK",
          city: "방콕",
          time: "2025-12-16T17:50",
        },
        duration: 340,
        cabinClass: "ECONOMY",
      },
      {
        segmentNo: 3,
        airline: {
          code: "VN",
          name: "베트남항공",
          logoUrl: "/airlines/VN.png",
        },
        flightNumber: "VN755",
        departure: {
          airportCode: "BKK",
          city: "방콕",
          time: "2025-12-16T19:20",
        },
        arrival: {
          airportCode: "DAD",
          city: "다낭",
          time: "2025-12-16T21:05",
        },
        duration: 105,
        cabinClass: "ECONOMY",
      },
    ],
  };



  // const tripType = "TRANSIT";
  // const segmentCount = 5;

  // 항공편 타입 정의
  const TRIP_TYPE = {
    ONE : "ONE", // 편도
    ROUND : "ROUND", // 왕복
    TRANSIT : "TRANSIT" // 경유
  }

  const changeIsWished = () => {
    setIsWished(true);
  };

  return (
    <div className="airline-detail-container">


      {/* 상단 헤더 (항공권 요약) */}
      <div className="ticket-header">
        <img className="ticekt-header-left" src={left} alt="<-" />

        <div className="ticekt-header-info">
          <div className="ticekt-header-route">인천(ICN) → 다낭(DAD)</div>
          <div className="ticekt-header-date">2025.12.16 · 
            {(tripInfo.tripType == "TRANSIT") ? "경유" :
             (tripInfo.tripType == "ROUND") ? "왕복" :
             (tripInfo.tripType == "ONE") ? "편도" : ""
          }
          </div>
        </div>

        {/* 찜 버튼 */}
        <button className={`ticekt-header-wish-btn (${isWished ? "active" : ""})`} onClick={changeIsWished}>
          {isWished ? "❤" : "♡"}
        </button>
      </div>




      {/* 메인 콘텐츠 */}
      <div className="airline-detail-layout">

        {/* 항공권 정보 영역 */}
        <div className="left-section">



          {/* 편도일 경우 */}
          {
            (tripInfo.tripType  == "ONE") && (
              <>
                {/* 가는 편 */}
                <p className="section-title">가는 편</p>
                <TicketBoxComponent />
              </>
            )
          }


          {/* 왕복일 경우 */}
          {
            (tripInfo.tripType == "ROUND") && (
              <>
                {/* 가는 편 */}
                <p className="section-title">가는 편</p>
                <TicketBoxComponent  showPlus={false}/>

                {/* 오는 편 */}
                <p className="section-title">오는 편</p>
                <TicketBoxComponent  showPlus={false}/>
              </>
            )
          }

          {/* 경유일 경우 */}
          {
            (tripInfo.tripType  == "TRANSIT") && (
              tripInfo.segments.map((segment, index) => 
                <TicketBoxComponent key={segment.segmentNo} segment={segment} tripType={tripInfo.tripType} showPlus={false}/>
              ))
          }

          {/* 가는 편 */}
          {/* <p className="section-title">가는 편</p>
          <TicketBoxComponent /> */}

          {/* 오는 편 */}
          {/* <p className="section-title">오는 편</p>
          <TicketBoxComponent /> */}

          {/* 리뷰 영역 */}
          <div className="review-wrapper">
            <ReviewComponent/>
          </div>

        </div>





        {/* 오른쪽 차트 */}
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

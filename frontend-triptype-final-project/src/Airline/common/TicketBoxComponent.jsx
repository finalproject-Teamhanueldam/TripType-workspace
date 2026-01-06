import { FaPlane, FaClock, FaMapMarkerAlt } from 'react-icons/fa'; 
import "./TicketBoxComponent.css";
import plus from "./images/plus.svg";

const TicketBoxComponent = ({
  segment,
  returnSegment,
  tripType,
  setOpen,
  onClick,
  showPlus = false,
  segments = null,
}) => {
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
    "싱가포르항공": "싱가포르항공.png",
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

  const AIRLINE_URL_MAP = {
    "대한항공": "https://www.koreanair.com",
    "아시아나항공": "https://www.flyasiana.com",
    "제주항공": "https://www.jejuair.net",
    "진에어": "https://www.jinair.com",
    "티웨이항공": "https://www.twayair.com",
    "에어부산": "https://www.airbusan.com",
    "에어서울": "https://www.flyairseoul.com",
    "전일본공수": "https://www.ana.co.jp",
    "일본항공": "https://www.jal.co.jp",
    "캐세이퍼시픽": "https://www.cathaypacific.com",
    "싱가포르항공": "https://www.singaporeair.com",
    "타이항공": "https://www.thaiairways.com",
    "베트남항공": "https://www.vietnamairlines.com",
    "유나이티드항공": "https://www.united.com",
    "델타항공": "https://www.delta.com",
    "아메리칸항공": "https://www.aa.com",
    "루프트한자": "https://www.lufthansa.com",
    "에어프랑스": "https://www.airfrance.com",
    "KLM 네덜란드항공": "https://www.klm.com",
    "에미레이트항공": "https://www.emirates.com"
  };

  const getAirlineLogo = (airlineName) => {
    if (!airlineName) airlineName = "트립타임 로고";
    const fileName = AIRLINE_LOGO_MAP[airlineName];
    return `/images/${fileName}`;
  }

  const getAirlineUrl = (airlineName) => {
    return AIRLINE_URL_MAP[airlineName] || null;
  }

  const safeSegments = Array.isArray(segments) && segments.length > 0 ? segments : null;
  const firstSeg = safeSegments ? safeSegments[0] : segment;
  const lastSeg = safeSegments ? safeSegments[safeSegments.length - 1] : segment;

  const segCount = safeSegments ? safeSegments.length : 1;
  const stops = Math.max(segCount - 1, 0);

  const tripTypeLabel =
    tripType === "MULTI" ? `다구간 (${segCount}구간)` :
    tripType === "TRANSIT" ? "경유" :
    tripType === "ONEWAY" ? (stops > 0 ? `편도 · ${stops}회 경유` : "편도") :
    tripType === "ROUND" ? "왕복" : "해당없음";

  if (!firstSeg) return null;

  const airlineUrl = getAirlineUrl(firstSeg.airlineName);

  return (
    <div className="ticket-box" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      {/* 항공사 */}
      <div className="ticket-airline">
        <img
          src={getAirlineLogo(firstSeg.airlineName)}
          className="airline-logo"
          alt="항공사 로고"
        />
        <div className="airline-name">{firstSeg.airlineName}</div>
        <div className="flight-number">
          <FaPlane className="icon-tiny" />
          {firstSeg.flightNumber}
        </div>

      {
        airlineUrl != null ? (
          <a
            href={airlineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="airline-link"
            onClick={(e) => e.stopPropagation()} // 클릭 시 부모 onClick 방지
          >
            항공사 방문
          </a>
        ) : <span>미지정 항공사</span>
      }

      </div>

      <div className="ticket-divider" />

      {/* 출발 / 도착 */}
      <div className="ticket-detail-row">
        <div className="flight-block">
          <div className="date">
            {new Date(firstSeg.departDate).toLocaleDateString("ko-KR")}
          </div>
          <div className="airport">
            <div>
              {firstSeg.departCity} <span className="airport-iata">({firstSeg.departAirportCode})</span>
            </div>
            <span className="time">
              {new Date(firstSeg.departDate).toLocaleTimeString("ko-KR", { hour: "numeric", minute: "numeric" })}
            </span>
          </div>
        </div>

        <div className="duration-block">
          <div className="duration-line-wrapper">
            <div className="flight-line" />
            <FaClock className="duration-icon-clock" />
            <div className="flight-line" />
          </div>
          <div className="duration">{firstSeg.flightDuration}</div>
          <div className="via-tag">{tripTypeLabel}</div>
        </div>

        <div className="flight-block">
          <div className="date">
            {new Date(lastSeg.arriveDate).toLocaleDateString("ko-KR")}
          </div>
          <div className="airport">
            <div>
              {lastSeg.arriveCity} <span className="airport-iata">({lastSeg.arriveAirportCode})</span>
            </div>
            <span className="time">
              {new Date(lastSeg.arriveDate).toLocaleTimeString("ko-KR", { hour: "numeric", minute: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {/* 가격 / 부가 정보 */}
      <div className="extra-info-row">
        <div className="sub-info">
          <div className="seat-status">
            잔여 좌석 <span className="status-value highlight">{firstSeg.extraSeat}</span>
          </div>
        </div>
        <div className="price-wrapper">
          <span className="price">{firstSeg.totalPrice?.toLocaleString()}원</span>
        </div>
      </div>

      {showPlus && (
        <div className="plus">
          <img
            src={plus}
            alt="추가"
            onClick={(e) => {
              e.stopPropagation();
              setOpen();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TicketBoxComponent;

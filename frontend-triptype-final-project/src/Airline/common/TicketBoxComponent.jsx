import { FaPlane, FaClock, FaMapMarkerAlt } from 'react-icons/fa'; 
import "./TicketBoxComponent.css";
import plus from "./images/plus.svg";

// ✅ segments 추가
const TicketBoxComponent = ({
  segment,
  returnSegment,
  tripType,
  setOpen,
  onClick,
  showPlus = false,
  segments = null, // ✅ MULTI/경유(편도) 대응
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

  const getAirlineLogo = (airlineName) => {
        if(airlineName == null || airlineName == undefined)
            airlineName = "트립타임 로고";
        const fileName = AIRLINE_LOGO_MAP[airlineName];
        return `/images/${fileName}`;
    }

  // ✅ segments가 있으면 첫/마지막 세그먼트 기준으로 표시값 만들기
  const safeSegments = Array.isArray(segments) && segments.length > 0 ? segments : null;
  const firstSeg = safeSegments ? safeSegments[0] : segment;
  const lastSeg = safeSegments ? safeSegments[safeSegments.length - 1] : segment;

  // ✅ 경유/구간수 계산
  const segCount = safeSegments ? safeSegments.length : 1;
  const stops = Math.max(segCount - 1, 0);

  const tripTypeLabel =
    tripType === "MULTI" ? `다구간 (${segCount}구간)` :
    tripType === "TRANSIT" ? "경유" :
    tripType === "ONEWAY" ? (stops > 0 ? `편도 · ${stops}회 경유` : "편도") :
    tripType === "ROUND" ? "왕복" : "해당없음";

  /* 날짜 */
  const findDay = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  /* 요일 */
  const findDate = (dateTime) => {
    const day = new Date(dateTime).getDay();
    return ["일", "월", "화", "수", "목", "금", "토"][day];
  };

  /* Duration 파싱 */
  const parseDuration = (duration) => {
    if (!duration || typeof duration !== "string") return { hours: 0, minutes: 0 };
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    return {
      hours: match?.[1] ? Number(match[1]) : 0,
      minutes: match?.[2] ? Number(match[2]) : 0,
    };
  };

  // ✅ duration은 “첫 세그먼트 duration”이 아니라,
  // - 백엔드가 전체 duration을 segment.flightDuration에 주면 그대로 사용
  // - 아니면 최소 대응으로 firstSeg.duration 표시(지금 구조 유지)
  const { hours, minutes } = parseDuration(firstSeg?.flightDuration);

  // ✅ 가격 계산: ROUND는 outbound + inbound, 그 외는 outbound(첫 구간) 기반
  // (멀티 전체 합계가 있다면 firstSeg.totalPrice에 이미 들어오는 구조로 가정)
  const basePrice = Number(firstSeg?.totalPrice || 0);
  const returnPrice = Number(returnSegment?.totalPrice || 0);

  const totalWon =
    tripType === "ROUND"
      ? 1600 * Math.floor(basePrice + returnPrice)
      : 1600 * Math.floor(basePrice);

  // 방어
  if (!firstSeg) return null;

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
      </div>

      <div className="ticket-divider" />

      {/* 출발 / 도착 */}
      <div className="ticket-detail-row">
        <div className="flight-block">
          <div className="date">
            {findDay(firstSeg.departDate)} ({findDate(firstSeg.departDate)})
          </div>
          <div className="airport">
            <div>
              {firstSeg.departCity}
              <span className="airport-iata">({firstSeg.departAirportCode})</span>
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

          <div className="duration">
            {hours}시간 {minutes}분
          </div>

          {/* ✅ MULTI/경유 정보 */}
          <div className="via-tag">{tripTypeLabel}</div>
        </div>

        <div className="flight-block">
          <div className="date">
            {findDay(lastSeg.arriveDate)} ({findDate(lastSeg.arriveDate)})
          </div>
          <div className="airport">
            <div>
              {lastSeg.arriveCity}
              <span className="airport-iata">({lastSeg.arriveAirportCode})</span>
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
            잔여 좌석
            <span className="status-value highlight">
              {firstSeg.extraSeat}
            </span>
          </div>
          <div className="terminal-info">
            <FaMapMarkerAlt className="icon-tiny" />
            터미널 정보
          </div>
        </div>

        <div className="price-wrapper">
          <span className="price">{totalWon.toLocaleString()}원</span>
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

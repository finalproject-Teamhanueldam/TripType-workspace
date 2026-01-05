import { FaPlane, FaClock, FaMapMarkerAlt } from 'react-icons/fa'; 
import "./TicketBoxComponent.css";
import plus from "./images/plus.svg";

// 1. 매개변수에 onClick을 추가합니다.
const TicketBoxComponent = ({ segment, returnSegment, tripType, setOpen, onClick, showPlus = false }) => {

    /* 항공사명 → 로고 파일명 */
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
    };

    
    /* 항공사 로고 경로 */
    const getAirlineLogo = (airlineName) => {
        const fileName = AIRLINE_LOGO_MAP[airlineName];
        return fileName ? `/images/${fileName}` : "";
    }

    console.log('returnSegment', returnSegment);
    console.log('tripType', tripType);

    const tripTypeLabel =
        tripType === "TRANSIT" ? "경유" :
        tripType === "ONEWAY" ? "편도" :
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
        if(!duration || typeof duration != "string") {
            return { hours : 0, minutes : 0 }
        }
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
        return {
            hours: match?.[1] ? Number(match[1]) : 0,
            minutes: match?.[2] ? Number(match[2]) : 0
        };
    };

    const { hours, minutes } = parseDuration(segment.flightDuration);

    return (
        // 2. 최상위 div에 onClick={onClick}을 연결합니다.
        <div className="ticket-box" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>

            {/* 항공사 */}
            <div className="ticket-airline">
            <img
                src={getAirlineLogo(segment.airlineName)}
                className="airline-logo"
                alt="항공사 로고"
            />
                <div className="airline-name">{segment.airlineName}</div>
                <div className="flight-number">
                    <FaPlane className="icon-tiny" />
                    {segment.flightNumber}
                </div>
            </div>

            <div className="ticket-divider" />

            {/* 출발 / 도착 */}
            <div className="ticket-detail-row">
                <div className="flight-block">
                    <div className="date">
                        {findDay(segment.departDate)} ({findDate(segment.departDate)})
                    </div>
                    <div className="airport">
                        <div>
                            {segment.departCity}
                            <span className="airport-iata">({segment.departAirportCode})</span>
                        </div>
                        <span className='time'>{new Date(segment.departDate).toLocaleTimeString("ko-KR", { hour: "numeric", minute: "numeric" })}</span>
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
                    <div className="via-tag">{tripTypeLabel}</div>
                </div>

                <div className="flight-block">
                    <div className="date">
                        {findDay(segment.arriveDate)} ({findDate(segment.arriveDate)})
                    </div>
                    <div className="airport">
                        <div>
                            {segment.arriveCity}
                            <span className="airport-iata">({segment.arriveAirportCode})</span>
                        </div>
                        <span className='time'>{new Date(segment.arriveDate).toLocaleTimeString("ko-KR", { hour: "numeric", minute: "numeric" })}</span>
                    </div>
                </div>
            </div>

            {/* 가격 / 부가 정보 */}
            <div className="extra-info-row">
                <div className="sub-info">
                    <div className="seat-status">
                        잔여 좌석
                        <span className="status-value highlight">
                            {segment.extraSeat}
                        </span>
                    </div>
                    <div className="terminal-info">
                        <FaMapMarkerAlt className="icon-tiny" />
                        터미널 정보
                    </div>
                </div>
                <div className="price-wrapper">
                    <span className="price">
                        { tripType != "ROUND" ? (1600 * Math.floor(segment.totalPrice)).toLocaleString() + '원' : 
                                                (1600 * Math.floor(segment.totalPrice + (returnSegment?.totalPrice || 0))).toLocaleString()+'원'}
                    </span>
                </div>
            </div>

            {showPlus && (
                <div className="plus">
                    {/* 3. 플러스 버튼 클릭 시 이벤트 전파 방지(stopPropagation)를 추가하여 
                           상세 페이지로 이동하지 않고 모달만 뜨게 합니다. */}
                    <img src={plus} alt="추가" onClick={(e) => {
                        e.stopPropagation();
                        setOpen();
                    }} />
                </div>
            )}
        </div>
    );
};

export default TicketBoxComponent;
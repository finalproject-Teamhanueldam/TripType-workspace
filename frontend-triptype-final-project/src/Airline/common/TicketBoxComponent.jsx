import { FaPlane, FaClock, FaMapMarkerAlt } from 'react-icons/fa'; 
import "./TicketBoxComponent.css";
import plus from "./images/plus.svg";

const TicketBoxComponent = ({ segment, tripType, setOpen, showPlus = false }) => {

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
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
        return {
            hours: match?.[1] ? Number(match[1]) : 0,
            minutes: match?.[2] ? Number(match[2]) : 0
        };
    };

    const { hours, minutes } = parseDuration(segment.flightDuration);

    return (
        <div className="ticket-box">

            {/* 항공사 */}
            <div className="ticket-airline">
                <img src="/logos/OZ.png" className="airline-logo" alt="항공사 로고" />
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
                        {segment.departCity}
                        <span className="airport-iata">({segment.departAirportCode})</span>
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
                        {segment.arriveCity}
                        <span className="airport-iata">({segment.arriveAirportCode})</span>
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
                        {segment.totalPrice?.toLocaleString()}원
                    </span>
                </div>
            </div>

            {showPlus && (
                <div className="plus">
                    <img src={plus} alt="추가" onClick={setOpen} />
                </div>
            )}
        </div>
    );
};

export default TicketBoxComponent;

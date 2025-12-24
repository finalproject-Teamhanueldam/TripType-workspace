import { FaPlane, FaClock, FaMapMarkerAlt } from 'react-icons/fa'; 
import "./TicketBoxComponent.css";
import plus from "./images/plus.svg";

const TicketBoxComponent = ({tripType, setOpen, showPlus=false}) => {

    // console.log(segment);
    // console.log(tripType);

    const tripTypeLabel = (tripType === "TRANSIT") ?  "경유" : 
                          (tripType === "ONE") ? "편도" :
                          (tripType === "ROUND") ? "왕복" : "해당없음";



    // 날짜 및 요일 함수
    const findDay = (dateTime) => {
        let date = new Date(dateTime);

        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        return year + "." + month + "." + day;
    };

    // 요일 함수
    const findDate = dateTime => {
        let today = new Date(dateTime).getDay();

        switch(today) {
            case 0 : today = "일"
                break;
            case 1 : today = "월"
                break;
            case 2 : today = "화"
                break;
            case 3 : today = "수"
                break;
            case 4 : today = "목"
                break;
            case 5 : today = "금"
                break;
            case 6 : today = "토"
        }

        return today;
    }



    // 시간 함수
    const findTime = (dateTime) => {
        let time = new Date(dateTime);
        let hours = (time.getHours());
        let minutes = time.getMinutes();

        if(hours < 10) {
            hours = '0' + hours;
        }
        if(minutes < 10) {
            minutes = '0' + minutes;
        }

        return hours + ":" + minutes;
    };



    return (
        <div className="ticket-box">

            {/* 1. 항공사 정보 섹션 */}
            <div className="ticket-airline">
                {/* 로고는 /public 폴더나 import 경로에 해당 파일이 있어야 표시됩니다. */}
                <img 
                    src="/logos/OZ.png" 
                    className="airline-logo" 
                    alt="아시아나항공 로고" 
                />
                <div className="airline-name">
                    {/* { segments[0].name } */}
                </div>
                <div className="flight-number">
                    <FaPlane className="icon-tiny" /> 
                    {/* { segments[0].airline.name } */}
                </div>
            </div>

            {/* 구분 라인 */}
            <div className="ticket-divider"></div>

            {/* 2. 출발 - 도착 정보 */}
            <div className="ticket-detail-row">

                {/* 출발 */}
                <div className="flight-block">
                    <div className="date">
                        {/* 년, 월, 일 / 요일 */}
                        {/* { findDay(segments[0].departure.time) }({findDate(segments[0].departure.time)}) */}
                    </div>
                    {/* 출발 시간 */}
                    <div className="time">
                        {/* {findTime(segments[0].departure.time)} */}
                    </div>
                    <div className="airport">
                        {/* { segments[0].departure.city } */}
                        <span className="airport-iata">
                            {/* ({ segments[0].departure.airportCode }) */}
                        </span>
                    </div>
                </div>

                {/* 가운데 Duration */}
                <div className="duration-block">
                    {/* Duration 아이콘과 라인 재구성 */}
                    <div className="duration-line-wrapper">
                        <div className="flight-line left"></div>
                        <FaClock className="duration-icon-clock" />
                        <div className="flight-line right"></div>
                    </div>
                    
                    <div className="duration">
                        {/* {`${Math.floor(segments[0].duration/60)}시간 ${Math.floor(segments[0].duration%60)}분`} */}
                    </div>
                    <div className="via via-tag">
                        {/* {tripTypeLabel} */}
                    </div>
                </div>

                {/* 도착 */}
                <div className="flight-block">
                    <div className="date">
                        {/* {findDay(segments[0].arrival.time)}({findDate(segments[0].arrival.time)}) */}
                    </div>
                    <div className="time">
                        {/* {findTime(segments[0].arrival.time)} */}
                    </div>
                    <div className="airport">
                        {/* { segments[0].arrival.city } */}
                        <span className="airport-iata">
                            {/* ({ segments[0].arrival.airportCode }) */}
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. 부가 정보 (ERD 반영: 잔여 좌석, 터미널 정보) */}
            <div className="extra-info-row">
                <div className="seat-status">
                    <span className="status-label">잔여 좌석: </span>
                    <span className="status-value highlight">7석 이상</span>
                </div>
                <div className="terminal-info">
                    <FaMapMarkerAlt className="icon-tiny" /> 
                    <span>
                        {/* {segments[0].departure.city} T2 - {segments[0].arrival.city} T2 */}
                    </span>
                </div>
            </div>

            {
                showPlus && (
                <div className='plus'>
                    <img src={plus} style={{"width" : "20px"}} onClick={setOpen}/>
                </div>
                )
            }
        </div>
    );
};

export default TicketBoxComponent;
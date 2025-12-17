import React from 'react';

import "../css/AirlineTicket.css" 


/**
 * ISO 형식 날짜/시간 문자열에서 'YYYY-MM-DD' 형식의 날짜를 추출
 */
const formatDate = (dateTimeString) => {
    // 예: "2025-01-10 09:30" -> "2025-01-10"
    return dateTimeString.split(' ')[0];
}

/**
 * ISO 형식 날짜/시간 문자열에서 'HH:MM' 형식의 시간을 추출
 */
const formatTime = (dateTimeString) => {
    // 예: "2025-01-10 09:30" -> "09:30"
    return dateTimeString.split(' ')[1];
}

/**
 * 숫자를 한국 통화(원) 형식으로 포맷팅
 */
const formatPrice = (price) => {
    return price.toLocaleString('ko-KR') + '원';
}

// --- 메인 컴포넌트 ---

const AirlineTicketComponent = () => {
    // 데이터 하드코딩 
    const mockTickets = [
        {
            id: 1,
            airlineName: "대한항공",
            airlineLogo: "/images/airline/korean.png",
            departAirport: "ICN",
            destAirport: "NRT",
            departDate: "2025-01-10 09:30",
            arriveDate: "2025-01-10 11:50",
            duration: "2h 20m",
            transfer: "직항",
            price: 320000,
            seats: 5,
        },
        {
            id: 2,
            airlineName: "아시아나",
            airlineLogo: "/images/airline/asiana.png",
            departAirport: "ICN",
            destAirport: "BKK",
            departDate: "2025-01-12 18:20",
            arriveDate: "2025-01-13 00:10", // 도착일이 다를 수 있음을 표시
            duration: "5h 50m",
            transfer: "경유",
            price: 410000,
            seats: 2,
        },
    ];

    const tickets = mockTickets;

    return (
        <div className="airline-wrap">
            <h2 className="main-title">✈️ 항공권 관리 시스템</h2>

            {/* 검색 및 버튼 영역 */}
            <div className="controls-container">
                <div className="search-sort-group">
                    <span className="total-count">총 {tickets.length}건</span>
                    <input 
                        type="text"
                        placeholder="항공사 / 공항명 / 공항코드 검색" 
                        className="search-input"
                    />
                    <select className="sort-select">
                        <option value="price-asc">가격 낮은 순</option>
                        <option value="depart-time-asc">출발시간 빠른 순</option>
                        <option value="duration-asc">소요시간 짧은 순</option>
                    </select>
                </div>
                <button className="action-btn primary-btn">API 조회</button>
            </div>

            {/* 항공권 목록 테이블 (개선된 디자인 적용) */}
            <table className="ticket-list-table">
                <thead>
                    <tr>
                        <th style={{ width: '15%' }}>항공사</th>
                        <th style={{ width: '25%' }}>노선 및 일정</th>
                        <th style={{ width: '15%' }}>소요시간</th>
                        <th style={{ width: '10%' }}>경유</th>
                        <th style={{ width: '15%' }}>가격</th>
                        <th style={{ width: '10%' }}>잔여좌석</th>
                        <th style={{ width: '10%' }}>관리</th>
                    </tr>
                </thead>

                <tbody>
                    {tickets.map(ticket => {
                        // 출발/도착 날짜가 다를 경우를 확인 (예시: ICN -> BKK)
                        const departDate = formatDate(ticket.departDate);
                        const arriveDate = formatDate(ticket.arriveDate);
                        const isNextDayArrival = departDate !== arriveDate;

                        return (
                            <tr key={ticket.id} className="ticket-item-row">

                                {/* 항공사 로고 or 항공사 명 */}
                                <td className="airline-info">
                                    <img
                                        src={ticket.airlineLogo}
                                        alt={ticket.airlineName}
                                        className="airline-logo"
                                    />
                                    <div className="airline-name">{ticket.airlineName}</div>
                                </td>

                                {/* 출발 날짜/시간, 출발 공항, 도착 공항 표시 */}
                                <td className="flight-route">
                                    <div className="time-group">
                                        <span className="time-code">
                                            {formatTime(ticket.departDate)} ({ticket.departAirport})
                                        </span>
                                        <span className="route-arrow">→</span>
                                        <span className={`time-code ${isNextDayArrival ? 'next-day' : ''}`}>
                                            {formatTime(ticket.arriveDate)} ({ticket.destAirport})
                                            {isNextDayArrival && <span className="next-day-label">+1일</span>}
                                        </span>
                                    </div>
                                    <div className="date-info">{departDate} 출발</div>
                                </td>
                                
                                {/* 총 소요시간 표시 */}
                                <td className="duration-info">{ticket.duration}</td>

                                {/* 경유 여부 표시 */}
                                <td className="transfer-info">
                                    <span className={`transfer-tag ${ticket.transfer === '직항' ? 'direct' : 'transfer'}`}>
                                        {ticket.transfer}
                                    </span>
                                </td>

                                {/* 가격 정보 표시 */}
                                <td className="price-info">
                                    <span className="price-text">
                                        {formatPrice(ticket.price)}
                                    </span>
                                </td>

                                {/* 잔여 좌석 표시 */}
                                <td className={`seats-info ${ticket.seats <= 5 ? 'low-seats' : ''}`}>
                                    {ticket.seats}석
                                </td>

                                {/* 삭제 버튼 */}
                                <td className="action-cell">
                                    <button className="action-btn delete-btn">삭제</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
       
    );
}

export default AirlineTicketComponent;
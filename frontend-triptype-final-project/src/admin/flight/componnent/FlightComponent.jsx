import React, { useState } from 'react';
import "../css/Flight.css" // CSS 파일은 동일하게 사용

// =========================================================================
// 헬퍼 함수
// =========================================================================

/**
 * ISO 형식 날짜/시간 문자열에서 'YYYY-MM-DD' 형식의 날짜를 추출
 */
const formatDate = (dateTimeString) => {
    // 예: "2025-01-10 09:30" -> "2025-01-10"
    if (!dateTimeString) return '-';
    return dateTimeString.split(' ')[0];
}

/**
 * ISO 형식 날짜/시간 문자열에서 'HH:MM' 형식의 시간을 추출
 */
const formatTime = (dateTimeString) => {
    // 예: "2025-01-10 09:30" -> "09:30"
    if (!dateTimeString) return '';
    return dateTimeString.split(' ')[1];
}

// =========================================================================
// 모의 데이터 (Mock Data)
// 불필요한 duration, transfer, price, seats 필드 제거됨
// =========================================================================

const mockTicketsData = [
    {
        id: 1,
        airlineName: "대한항공",
        airlineLogo: "/images/airline/korean.png",
        departAirport: "ICN",
        destAirport: "NRT",
        departDate: "2025-01-10 09:30",
        arriveDate: "2025-01-10 11:50",
        lastCheckedDate: "2025-12-16 10:00", // 최근 조회 일시
        price: "420,610 원",
    },
    {
        id: 2,
        airlineName: "아시아나",
        airlineLogo: "/images/airline/asiana.png",
        departAirport: "ICN",
        destAirport: "BKK",
        departDate: "2025-01-12 18:20",
        arriveDate: "2025-01-13 00:10", // 도착일이 다를 수 있음
        lastCheckedDate: "2025-12-17 09:30", // 최근 조회 일시
        price: "350,610 원",
    },
    {
        id: 3,
        airlineName: "제주항공",
        airlineLogo: "/images/airline/jeju.png",
        departAirport: "GMP",
        destAirport: "CJU",
        departDate: "2025-01-15 11:00",
        arriveDate: "2025-01-15 12:00",
        lastCheckedDate: "2025-12-16 18:00", // 최근 조회 일시
        price: "630,100 원",
    },
];

// =========================================================================
// 메인 컴포넌트
// =========================================================================

const FlightComponent = () => {
    const [tickets, setTickets] = useState(mockTicketsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('airline');
    const [selectedTickets, setSelectedTickets] = useState([]);

    // 전체 선택/해제 핸들러
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedTickets(tickets.map(ticket => ticket.id));
        } else {
            setSelectedTickets([]);
        }
    };

    // 개별 티켓 선택/해제 핸들러
    const handleSelectTicket = (id) => {
        setSelectedTickets(prev =>
            prev.includes(id) ? prev.filter(ticketId => ticketId !== id) : [...prev, id]
        );
    };

    // 전체 티켓이 선택되었는지 확인
    const isAllSelected = tickets.length > 0 && selectedTickets.length === tickets.length;

    // 검색 실행 (프론트엔드 필터링 예시)
    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            setTickets(mockTicketsData); // 검색어 없으면 전체 데이터 표시
            return;
        }

        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        
        const filteredTickets = mockTicketsData.filter(ticket => {
            switch (searchType) {
                case 'airline':
                    return ticket.airlineName.includes(searchTerm);
                case 'departAirport':
                    return ticket.departAirport.toLowerCase().includes(lowerCaseSearchTerm);
                case 'destAirport':
                    return ticket.destAirport.toLowerCase().includes(lowerCaseSearchTerm);
                case 'departDate':
                    // YYYY-MM-DD 형식으로 검색
                    return formatDate(ticket.departDate).includes(searchTerm);
                default:
                    return true;
            }
        });

        setTickets(filteredTickets);
    };

    // API 조회 버튼 핸들러 (더미)
    const handleApiCheck = () => {
        alert("API 조회 기능 실행: 최신 정보로 업데이트합니다.");
        // 실제 API 호출 로직을 여기에 구현
    };

    // 일괄 삭제 버튼 핸들러 (더미)
    const handleBulkDelete = () => {
        if (selectedTickets.length === 0) {
            alert("삭제할 항공권을 선택해주세요.");
            return;
        }
        if (window.confirm(`선택된 항공권 ${selectedTickets.length}개를 일괄 삭제하시겠습니까?`)) {
            setTickets(prev => prev.filter(ticket => !selectedTickets.includes(ticket.id)));
            setSelectedTickets([]);
            alert("선택된 항공권이 삭제되었습니다.");
        }
    };
    
    // 개별 삭제 버튼 핸들러 (더미)
    const handleDelete = (id) => {
         if (window.confirm(`선택한 항공권을 삭제하시겠습니까?`)) {
            setTickets(prev => prev.filter(ticket => ticket.id !== id));
            alert("항공권이 삭제되었습니다.");
        }
    };


    return (
        <div className="flight-wrap">
            <div className="flight-main-wrap">
                <h2 className="flight-main-title">항공권 관리 시스템</h2>

                {/* 검색 및 버튼 영역 */}
                <div className="controls-container">
                    <div className="search-sort-group">
                        {/* 검색 기준 선택: 항공사명, 출발/도착 공항, 운항일 */}
                        <select
                            className="sort-select"
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value="airline">항공사명</option>
                            <option value="departAirport">출발 공항 (IATA)</option>
                            <option value="destAirport">도착 공항 (IATA)</option>
                            <option value="departDate">운항일 (출발일 기준)</option>
                        </select>

                        {/* 검색어 입력 */}
                        <input
                            type="text"
                            placeholder="검색어 입력"
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            
                        />
                        <button className="action-btn search-btn" onClick={handleSearch}>검색</button>
                        <button className="action-btn reset-btn" onClick={handleSearch}>초기화</button>
                        
                    </div>
                    
                    <div className="action-buttons-group">
                        <span className="total-count">조회 결과 총 {tickets.length}건</span>
                        <button className="action-btn secondary-btn" onClick={handleApiCheck}>API 조회</button>
                        <button className="action-btn danger-btn" onClick={handleBulkDelete}>일괄 삭제 ({selectedTickets.length})</button>
                    </div>
                </div>

                {/* 항공권 목록 테이블 (요청된 컬럼만 반영) */}
                <table className="ticket-list-table">
                    <thead>
                        <tr>
                            <th style={{ width : '4%'}}>
                                <input 
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={isAllSelected}
                                />
                            </th>
                            <th style={{ width: '12%' }}>항공사</th>
                            <th style={{ width: '10%' }}>출발 공항</th>
                            <th style={{ width: '10%' }}>도착 공항</th>
                            <th style={{ width: '13%' }}>출발 일시</th>
                            <th style={{ width: '13%' }}>도착 일시</th>
                            <th style={{ width: '10%' }}>가격</th>
                            <th style={{ width: '15%' }}>최근 조회 일시</th>
                            <th style={{ width: '8%' }}>관리</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tickets.length > 0 ? (
                            tickets.map(ticket => {
                                const departDateOnly = formatDate(ticket.departDate);
                                const arriveDateOnly = formatDate(ticket.arriveDate);
                                const isNextDayArrival = departDateOnly !== arriveDateOnly;
                                const isSelected = selectedTickets.includes(ticket.id);

                                return (
                                    <tr key={ticket.id} className="ticket-item-row">

                                        {/* 체크박스 */}
                                        <td>
                                            <input 
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleSelectTicket(ticket.id)}
                                            />
                                        </td>
                                        
                                        {/* 항공사 (로고 + 이름) */}
                                        <td className="airline-info">
                                            <img
                                                src={ticket.airlineLogo}
                                                alt={ticket.airlineName}
                                                className="airline-logo"
                                            />
                                            <div className="airline-name">{ticket.airlineName}</div>
                                        </td>

                                        {/* 출발 공항 (IATA) */}
                                        <td>
                                            <div className="airport-code">{ticket.departAirport}</div>
                                        </td>
                                        
                                        {/* 도착 공항 (IATA) */}
                                        <td>
                                            <div className="airport-code">{ticket.destAirport}</div>
                                        </td>

                                        {/* 출발 일시 */}
                                        <td className="datetime-info">
                                            <div className="date-display">{departDateOnly}</div>
                                            <div className="time-display">{formatTime(ticket.departDate)}</div>
                                        </td>

                                        {/* 도착 일시 */}
                                        <td className="datetime-info">
                                            <div className="date-display">
                                                {arriveDateOnly}
                                                {isNextDayArrival && <span className="next-day-label">+1일</span>}
                                            </div>
                                            <div className="time-display">{formatTime(ticket.arriveDate)}</div>
                                        </td>
                                        
                                        {/* 가격 정보 */}
                                        <td>
                                            <div className="price-info">{ticket.price}</div>
                                        </td>
                                        {/* 최근 조회 일시 */}
                                        <td className="datetime-info last-checked">
                                            <div className="date-display">{formatDate(ticket.lastCheckedDate)}</div>
                                            <div className="time-display">{formatTime(ticket.lastCheckedDate)}</div>
                                        </td>
                                        
                                        {/* 관리 (개별 삭제 버튼) */}
                                        <td className="action-cell">
                                            <button 
                                                className="action-btn delete-btn"
                                                onClick={() => handleDelete(ticket.id)}
                                            >
                                                삭제
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr className="no-results">
                                <td colSpan="8">검색 결과가 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FlightComponent;
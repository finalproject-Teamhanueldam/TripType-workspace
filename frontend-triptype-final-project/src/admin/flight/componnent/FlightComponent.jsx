import { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/Flight.css";

/** 날짜 및 시간 포맷 함수 */
const formatDate = (dateTimeString) => {
    if (!dateTimeString) return '-';
    return dateTimeString.split('T')[0] || dateTimeString.split(' ')[0];
}
const formatTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const time = dateTimeString.includes('T') ? dateTimeString.split('T')[1] : dateTimeString.split(' ')[1];
    return time ? time.substring(0, 5) : '';
}

const FlightComponent = () => {
    const [allTickets, setAllTickets] = useState([]); // 원본 데이터
    const [tickets, setTickets] = useState([]);       // 화면 표시용
    const [selectedTickets, setSelectedTickets] = useState([]);

    // 다중 필터 상태 (destDate 제거, airlineName 추가)
    const [filters, setFilters] = useState({
        airlineName: '',     // 추가: 항공사 필터
        departAirport: '',
        destAirport: '',
        departDate: ''       // 도착일(destDate) 제거됨
    });

    useEffect(() => {
        selectTickets();
    }, []);

    const selectTickets = async () => {
        try {
            const response = await axios.get("http://localhost:8001/triptype/admin/flight/selectTickets");
            setTickets(response.data);
            setAllTickets(response.data);
        } catch (error) {
            console.error("데이터 로드 실패", error);
        }
    };

    const fetchflight = async () => {
        try {
            await axios.get("http://localhost:8001/triptype/admin/flight/fetchflight");
            alert("API 조회 성공! 최신 정보로 업데이트합니다.");
            selectTickets();
        } catch (error) {
            alert("API 조회 중 오류가 발생했습니다.");
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // 검색 실행 (항공사 필터 포함, 도착일 필터 제외)
    const handleSearch = () => {
        const filtered = allTickets.filter(ticket => {
            const airline = (ticket.sellingAirlineName || ticket.airlineName || '').toLowerCase();
            return (
                (!filters.airlineName || airline.includes(filters.airlineName.toLowerCase())) &&
                (!filters.departAirport || ticket.departAirport?.toLowerCase().includes(filters.departAirport.toLowerCase())) &&
                (!filters.destAirport || (ticket.arriveAirport || ticket.destAirport)?.toLowerCase().includes(filters.destAirport.toLowerCase())) &&
                (!filters.departDate || formatDate(ticket.departDateTime || ticket.departDate).includes(filters.departDate))
            );
        });
        setTickets(filtered);
    };

    const handleReset = () => {
        setFilters({ airlineName: '', departAirport: '', destAirport: '', departDate: '' });
        setTickets(allTickets);
    };

    const handleSelectAll = (e) => {
        setSelectedTickets(e.target.checked ? tickets.map(t => t.id) : []);
    };
    const handleSelectTicket = (id) => {
        setSelectedTickets(prev => prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]);
    };

    // 일괄 삭제 기능구현 제외 (UI만 유지)
    const handleBulkDelete = () => {
        if (selectedTickets.length === 0) return alert("삭제할 항공권을 선택해주세요.");
        // 기능 구현 생략
    };

    const handleDelete = (id) => {
        if (window.confirm("삭제하시겠습니까?")) {
            setTickets(prev => prev.filter(t => t.id !== id));
        }
    };

    return (
        <div className="flight-wrap">
            <div className="flight-main-wrap">
                <h2 className="flight-main-title">항공권 관리 시스템</h2>

                <div className="fixed-header-section">
                    <div className="filter-input-container">
                        <div className="filter-input-group">
                            {/* 항공사 필터: 가장 왼쪽에 추가 */}
                            <div className="input-box">
                                <span>항공사</span>
                                <input name="airlineName" value={filters.airlineName} onChange={handleFilterChange} placeholder="항공사명" />
                            </div>
                            <div className="input-box">
                                <span>출발지</span>
                                <input name="departAirport" value={filters.departAirport} onChange={handleFilterChange} placeholder="공항코드(ICN)" />
                            </div>
                            <div className="input-box">
                                <span>도착지</span>
                                <input name="destAirport" value={filters.destAirport} onChange={handleFilterChange} placeholder="공항코드(NRT)" />
                            </div>
                            <div className="input-box">
                                <span>출발일</span>
                                <input type="date" name="departDate" value={filters.departDate} onChange={handleFilterChange} />
                            </div>
                            {/* 도착일 필터 제거됨 */}
                        </div>
                        <div className="search-action-btns">
                            <button className="action-btn search-btn" onClick={handleSearch}>검색</button>
                            <button className="action-btn reset-btn" onClick={handleReset}>초기화</button>
                        </div>
                    </div>

                    <div className="status-and-bulk-actions">
                        <span className="total-count">조회 결과 총 <strong>{tickets.length}</strong>건</span>
                        {/* 버튼 간격 조정을 위한 inline-style 또는 CSS gap 적용 */}
                        <div className="action-group" style={{ display: 'flex', gap: '10px' }}>
                            <button className="action-btn secondary-btn" onClick={fetchflight}>API 조회</button>
                            <button className="action-btn danger-btn" onClick={handleBulkDelete}>일괄 삭제 ({selectedTickets.length})</button>
                        </div>
                    </div>
                </div>

                <div className="table-container">
                    <table className="ticket-list-table">
                        <thead>
                            <tr>
                                <th style={{ width: '4%' }}>
                                    <input type="checkbox" onChange={handleSelectAll} checked={tickets.length > 0 && selectedTickets.length === tickets.length} />
                                </th>
                                <th style={{ width: '12%' }}>항공사</th>
                                <th style={{ width: '10%' }}>출발 공항</th>
                                <th style={{ width: '10%' }}>도착 공항</th>
                                <th style={{ width: '13%' }}>출발 일시</th>
                                <th style={{ width: '13%' }}>도착 일시</th>
                                <th style={{ width: '10%' }}>가격</th>
                                <th style={{ width: '15%' }}>최근 조회</th>
                                <th style={{ width: '8%' }}>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.length > 0 ? (
                                tickets.map(ticket => (
                                    <tr key={ticket.id} className="ticket-item-row">
                                        <td><input type="checkbox" checked={selectedTickets.includes(ticket.id)} onChange={() => handleSelectTicket(ticket.id)} /></td>
                                        <td className="airline-name">{ticket.sellingAirlineName || ticket.airlineName}</td>
                                        <td className="airport-code">{ticket.departAirport}</td>
                                        <td className="airport-code">{ticket.arriveAirport || ticket.destAirport}</td>
                                        <td className="datetime-info">
                                            <div className="date-display">{formatDate(ticket.departDateTime || ticket.departDate)}</div>
                                            <div className="time-display">{formatTime(ticket.departDateTime || ticket.departDate)}</div>
                                        </td>
                                        <td className="datetime-info">
                                            <div className="date-display">{formatDate(ticket.arriveDateTime || ticket.arriveDate)}</div>
                                            <div className="time-display">{formatTime(ticket.arriveDateTime || ticket.arriveDate)}</div>
                                        </td>
                                        <td><div className="price-info">{Number(ticket.priceTotal || ticket.price || 0).toLocaleString()}원</div></td>
                                        <td className="datetime-info last-checked">
                                            <div className="date-display">{formatDate(ticket.apiQueryDate)}</div>
                                            <div className="time-display">{formatTime(ticket.apiQueryDate)}</div>
                                        </td>
                                        <td className="action-cell">
                                            <button className="delete-btn" onClick={() => handleDelete(ticket.id)}>삭제</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="no-results"><td colSpan="9">검색 결과가 없습니다.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default FlightComponent;
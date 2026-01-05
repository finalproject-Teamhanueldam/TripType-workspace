import { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/Flight.css";

/** 날짜 및 시간 포맷 함수 */
const formatDate = (dateTimeString) => {
    if (!dateTimeString) return '-';
    return dateTimeString.includes('T')
        ? dateTimeString.split('T')[0]
        : dateTimeString.split(' ')[0];
};

const formatTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const time = dateTimeString.includes('T')
        ? dateTimeString.split('T')[1]
        : dateTimeString.split(' ')[1];
    return time ? time.substring(0, 5) : '';
};

const FlightComponent = () => {
    const [allTickets, setAllTickets] = useState([]);
    const [ticket, setTickets] = useState([]);
    const [selectedTickets, setSelectedTickets] = useState([]);

    const [filters, setFilters] = useState({
        airlineName: '',
        departAirport: '',
        destAirport: '',
        departDate: ''
    });

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        selectTickets();
    }, []);

    const selectTickets = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/admin/flight/selectTickets`
            );
            setTickets(response.data);
            setAllTickets(response.data);
        } catch (error) {
            console.error("데이터 로드 실패", error);
        }
    };

    const fetchflight = async () => {
        // 1) 조회 확인 창
        const ok = window.confirm("API 조회를 실행하시겠습니까? (최신 항공권 정보를 갱신합니다.)");
        if (!ok) return;

        try {
            await axios.get(`${API_BASE_URL}/admin/flight/fetchflight`);
            alert("API 조회 성공! 최신 정보로 업데이트합니다.");
            selectTickets();
        } catch (error) {
            console.error(error);
            alert("API 조회 중 오류가 발생했습니다.");
        }
        };


    // 삭제 기능
    const deleteOffers = async (ids) => {
        await axios.post(
            `${API_BASE_URL}/admin/flight/delete`,
            { flightOfferIds: ids }
        );
    };


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        const filtered = allTickets.filter(t => {
            const airline = (t.airlineName || '').toLowerCase();
            const out = t.outbound;

            return (
                (!filters.airlineName || airline.includes(filters.airlineName.toLowerCase())) &&
                (!filters.departAirport || out?.departAirport?.toLowerCase().includes(filters.departAirport.toLowerCase())) &&
                (!filters.destAirport || out?.arriveAirport?.toLowerCase().includes(filters.destAirport.toLowerCase())) &&
                (!filters.departDate || formatDate(out?.departDateTime).includes(filters.departDate))
            );
        });
        setTickets(filtered);
    };

    const handleReset = () => {
        setFilters({ airlineName: '', departAirport: '', destAirport: '', departDate: '' });
        setTickets(allTickets);
    };

    const handleSelectAll = (e) => {
        setSelectedTickets(
            e.target.checked ? ticket.map(t => t.flightOfferId) : []
        );
    };

    const handleSelectTicket = (id) => {
        setSelectedTickets(prev =>
            prev.includes(id)
                ? prev.filter(tId => tId !== id)
                : [...prev, id]
        );
    };

    // 단건 삭제
    const handleDelete = async (id) => {

        if (!window.confirm("삭제하시겠습니까?")) return;

        await deleteOffers([id]);

        setTickets(prev =>
            prev.filter(t => t.flightOfferId !== id)
        );
    };

    // 다건 삭제
    const handleBulkDelete = async () => {
        if (selectedTickets.length === 0) {
            alert("삭제할 항공권을 선택해주세요.");
            return;
        }

        if (!window.confirm(`선택한 ${selectedTickets.length}건을 삭제하시겠습니까?`)) {
            return;
        }

        await deleteOffers(selectedTickets);

        setTickets(prev =>
            prev.filter(t => !selectedTickets.includes(t.flightOfferId))
        );

        setSelectedTickets([]);
    };
    return (
        <div className="flight-wrap">
            <div className="flight-main-wrap">
                <h2 className="flight-main-title">항공권 관리 시스템</h2>

                <div className="fixed-header-section">
                    <div className="filter-input-container">
                        <div className="filter-input-group">
                            <div className="input-box">
                                <span>항공사</span>
                                <input
                                    name="airlineName"
                                    value={filters.airlineName}
                                    onChange={handleFilterChange}
                                    placeholder="항공사명"
                                />
                            </div>
                            <div className="input-box">
                                <span>출발지</span>
                                <input
                                    name="departAirport"
                                    value={filters.departAirport}
                                    onChange={handleFilterChange}
                                    placeholder="ICN"
                                />
                            </div>
                            <div className="input-box">
                                <span>도착지</span>
                                <input
                                    name="destAirport"
                                    value={filters.destAirport}
                                    onChange={handleFilterChange}
                                    placeholder="NRT"
                                />
                            </div>
                            <div className="input-box">
                                <span>출발일</span>
                                <input
                                    type="date"
                                    name="departDate"
                                    value={filters.departDate}
                                    onChange={handleFilterChange}
                                />
                            </div>
                        </div>

                        <div className="search-action-btns">
                            <button className="admin-action-btn admin-search-btn" onClick={handleSearch}>검색</button>
                            <button className="admin-action-btn admin-reset-btn" onClick={handleReset}>초기화</button>
                        </div>
                    </div>

                    <div className="status-and-bulk-actions">
                        <span className="total-count">
                            조회 결과 총 <strong>{ticket.length}</strong>건
                        </span>
                        <div className="action-group" style={{ display: 'flex', gap: '10px' }}>
                            <button className="admin-action-btn admin-secondary-btn" onClick={fetchflight}>API 조회</button>
                            <button className="admin-action-btn admin-danger-btn" onClick={handleBulkDelete}>
                                일괄 삭제 ({selectedTickets.length})
                            </button>
                        </div>
                    </div>
                </div>

                <div className="table-container">
                    <table className="ticket-list-table">
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}>
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={ticket.length > 0 && selectedTickets.length === ticket.length}
                                    />
                                </th>
                                <th style={{ width: '12%' }}>항공사</th>
                                <th style={{ width: '8%' }}>출발</th>
                                <th style={{ width: '8%' }}>도착</th>
                                <th style={{ width: '18%' }}>가는 편 (출발 → 도착)</th>
                                <th style={{ width: '18%' }}>오는 편 (출발 → 도착)</th>
                                <th style={{ width: '12%' }}>가격</th>
                                <th style={{ width: '12%' }}>최근 조회</th>
                                <th style={{ width: '8%' }}>관리</th>
                            </tr>
                        </thead>

                        <tbody>
                            {ticket.length > 0 ? (
                                ticket.map(t => {
                                    const out = t.outbound;
                                    const inc = t.inbound;
                                    const isRT = t.oneWayYn === 'N';

                                    return (
                                        <tr key={t.flightOfferId} className="ticket-item-row">
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTickets.includes(t.flightOfferId)}
                                                    onChange={() => handleSelectTicket(t.flightOfferId)}
                                                />
                                            </td>
                                            <td className="airline-name">{t.airlineName}</td>
                                            <td className="airport-code">{out?.departAirport}</td>
                                            <td className="airport-code">{out?.arriveAirport}</td>
                                            
                                            {/* 가는 편 일정 */}
                                            <td>
                                                <div className="datetime-info">
                                                    <div className="date-display">{formatDate(out?.departDateTime)}</div>
                                                    <div className="time-display">
                                                        {formatTime(out?.departDateTime)}
                                                        <span className="time-separator">→</span>
                                                        {formatTime(out?.arriveDateTime)}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* 오는 편 일정 (왕복일 때만) */}
                                            <td>
                                                <div className="datetime-info">
                                                    {isRT ? (
                                                        <>
                                                            <div className="date-display">{formatDate(inc?.departDateTime)}</div>
                                                            <div className="time-display">
                                                                {formatTime(inc?.departDateTime)}
                                                                <span className="time-separator">→</span>
                                                                {formatTime(inc?.arriveDateTime)}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <span className="one-way-label">편도(None)</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* 가격 셀 보정 */}
                                            <td>
                                                <div className="admin-flight-price-info">
                                                    <strong>{Number(t.priceTotal || 0).toLocaleString()}</strong>
                                                    <span className="currency">{t.currency}</span>
                                                </div>
                                            </td>

                                            {/* 최근 조회 셀 보정 */}
                                            <td>
                                                <div className="datetime-info last-checked">
                                                    <div className="date-display">{formatDate(t.apiQueryDate)}</div>
                                                    <div className="time-display" style={{fontSize: '14px'}}>
                                                        {formatTime(t.apiQueryDate)}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="action-cell">
                                                <button
                                                    className="admin-flight-delete-btn"
                                                    onClick={() => handleDelete(t.flightOfferId)}
                                                >
                                                    삭제
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr className="no-results">
                                    <td colSpan="9">검색 결과가 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FlightComponent;
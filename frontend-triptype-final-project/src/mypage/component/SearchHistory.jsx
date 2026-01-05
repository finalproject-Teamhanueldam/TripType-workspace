import MyPageSectionTitle from "../common/component/MyPageSectionTitle";
import "../css/SearchHistory.css";
import "../css/MyPageCommon.css";
import "../css/SearchHistory.css"; 
import { useState, useEffect } from 'react';
import axios from "axios";

function SearchHistory() {

  // 날짜 및 시간 포맷팅 함수
  const formatDateTime = (dateTime) => {
    if (!dateTime) return '-';

    // "2026-01-05T13:42:18" 또는 "2026-01-05 13:42:18"
    const normalized = dateTime.replace('T', ' ');
    const [date, time] = normalized.split(' ');

    if (!time) return date.replaceAll('-', '.');

    return `${date.replaceAll('-', '.')} ${time.substring(0, 5)}`;
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    
    const fetchSearchHistory = async () => {
      try {
        const url = `${API_BASE_URL}/api/mypage/searchHistory`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        });
        setSearchHistory(response.data);
      } catch (error) {
        console.error("검색 기록 로드 실패", error);
      }
    }
    fetchSearchHistory();
  }, []);

  return (
    <div className="sh-container">
      <MyPageSectionTitle title="검색 기록" />

      <div className="sh-card-wrapper">
        <div className="sh-card-header">
          <span className="sh-count-badge">총 {searchHistory.length}건</span>
        </div>

        <div className="sh-table-responsive">
          <table className="sh-data-table">
            <thead>
              <tr>
                <th>출발</th>
                <th>도착</th>
                <th>출발일자</th>
                <th>돌아오는날짜</th>
                <th>인원</th>
                <th>검색일시</th>
              </tr>
            </thead>
            <tbody>
              {searchHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="sh-empty-row">
                    최근 검색한 기록이 없습니다.
                  </td>
                </tr>
              ) : (
                searchHistory.map((history, index) => (
                  <tr key={index}>
                    <td className="sh-cell-airport">{history.departIata}</td>
                    <td className="sh-cell-airport">{history.arriveIata}</td>
                    <td>{history.departDate}</td>
                    <td>{history.returnDate || '-'}</td>
                    <td>{history.passengerCount}명</td>
                    <td className="sh-cell-date">
                      {formatDateTime(history.searchLogDate)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <p className="sh-footer-notice">
          * 최근 검색하신 내역이 자동으로 저장됩니다.
        </p>
      </div>
    </div>
  );
}

export default SearchHistory;
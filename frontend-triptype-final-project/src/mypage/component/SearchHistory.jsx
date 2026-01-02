import MyPageSectionTitle from "../common/component/MyPageSectionTitle";
import "../css/SearchHistory.css";
import "../css/MyPageCommon.css";

function SearchHistory() {
  return (
    <div className="mypage-page">
      <MyPageSectionTitle title="검색 기록" />

      <div className="mypage-card">
        <h3 className="mypage-card-title">최근 검색 기록</h3>

        <table className="history-table">
          <thead>
            <tr>
              <th>출발</th>
              <th>도착</th>
              <th>출발일</th>
              <th>도착일</th>
              <th>인원</th>
              <th>검색일시</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ICN</td>
              <td>NRT</td>
              <td>2026-02-01</td>
              <td>2026-02-05</td>
              <td>2</td>
              <td>2026-01-01 12:00</td>
            </tr>
          </tbody>
        </table>

        <p className="mypage-muted" style={{ marginTop: 12 }}>
          API 붙이면 최신순으로 자동 렌더링 됩니다.
        </p>
      </div>
    </div>
  );
}

export default SearchHistory;

import { useState } from "react";
import "../style/FilterSection.css";
import { AiFillDelete } from "react-icons/ai";

const FilterSection = () => {
  const [tripType, setTripType] = useState("round");

  // 다구간 구간 리스트
  const [segments, setSegments] = useState([
    { departure: "", arrival: "", date: "" }
  ]);

  // 왕복/편도 전용
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // 체크박스
  const [nearDepart, setNearDepart] = useState(false);
  const [nearArrival, setNearArrival] = useState(false);

  // 다구간 추가
  const addSegment = () => {
    setSegments([...segments, { departure: "", arrival: "", date: "" }]);
  };

  // 다구간 삭제
  const removeSegment = (index) => {
    if (segments.length === 1) return; // 최소 1개 유지
    setSegments(segments.filter((_, i) => i !== index));
  };

  return (
    <section className="filter-section">

      {/* 🔷 왕복/편도/다구간 선택 */}
      <div className="trip-type-box">
        <select
          value={tripType}
          onChange={(e) => setTripType(e.target.value)}
        >
          <option value="round">왕복</option>
          <option value="oneway">편도</option>
          <option value="multi">다구간</option>
        </select>
      </div>

      {/* ================================
          🔵  다구간 UI
          ================================ */}
      {tripType === "multi" && (
        <div className="multi-container">

          {segments.map((seg, idx) => (
            <div className="multi-row" key={idx}>

              {/* 출발지 */}
              <div className="filter-item">
                <label>출발지</label>
                <input
                  placeholder="도시명 또는 공항명"
                  value={seg.departure}
                  onChange={(e) => {
                    const newSeg = [...segments];
                    newSeg[idx].departure = e.target.value;
                    setSegments(newSeg);
                  }}
                />
              </div>

              <div className="switch-icon">⇄</div>

              {/* 도착지 */}
              <div className="filter-item">
                <label>도착지</label>
                <input
                  placeholder="도시명 또는 공항명"
                  value={seg.arrival}
                  onChange={(e) => {
                    const newSeg = [...segments];
                    newSeg[idx].arrival = e.target.value;
                    setSegments(newSeg);
                  }}
                />
              </div>

              {/* 날짜 */}
              <div className="filter-item">
                <label>가는 편</label>
                <input
                  type="date"
                  value={seg.date}
                  onChange={(e) => {
                    const newSeg = [...segments];
                    newSeg[idx].date = e.target.value;
                    setSegments(newSeg);
                  }}
                />
              </div>

              {/* 🔥 삭제 버튼 */}
              {segments.length > 1 && (
                <button
                  className="delete-btn"
                  onClick={() => removeSegment(idx)}
                >
                  <AiFillDelete />
                </button>
              )}
            </div>
          ))}

          {/* 항공편 추가 버튼 */}
          <div className="multi-add-row" onClick={addSegment}>
            + 다른 항공편 추가
          </div>
        </div>
      )}

      {/* ================================
          🔵  왕복/편도 UI
          ================================ */}
      {(tripType === "round" || tripType === "oneway") && (
        <div className="filter-main-row">
          {/* 출발지 */}
          <div className="filter-item">
            <label>출발지</label>
            <input
              placeholder="출발지 입력"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            />
          </div>

          <div className="switch-icon">⇄</div>

          {/* 도착지 */}
          <div className="filter-item">
            <label>도착지</label>
            <input
              placeholder="도착지 입력"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
            />
          </div>

          {/* 가는 편 */}
          <div className="filter-item">
            <label>가는 편</label>
            <input
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
            />
          </div>

          {/* 오는 편 (왕복만) */}
          {tripType === "round" && (
            <div className="filter-item">
              <label>오는 편</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>
          )}

          <button className="search-btn">검색</button>
        </div>
      )}

      {/* 체크박스 */}
      <div className="checkbox-row">
        <label>
          <input
            type="checkbox"
            checked={nearDepart}
            onChange={() => setNearDepart(!nearDepart)}
          />
          주변 공항 추가
        </label>

        <label>
          <input
            type="checkbox"
            checked={nearArrival}
            onChange={() => setNearArrival(!nearArrival)}
          />
          주변 공항 추가
        </label>
      </div>
    </section>
  );
};

export default FilterSection;

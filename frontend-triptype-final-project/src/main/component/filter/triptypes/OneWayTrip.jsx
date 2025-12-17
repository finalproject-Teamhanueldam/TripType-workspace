// OneWayTrip.jsx
import "../../../style/filter/triptypes/OneWayTrip.css";
import { useRef } from "react";
import { format } from "date-fns";

const OneWayTrip = ({
  depart,
  arrive,
  startDate,
  setDepart,
  setArrive,
  onSwap,
  onOpenCalendar,
}) => {
  const svgRef = useRef(null);

  const handleSwap = () => {
    if (!depart || !arrive) return;

    onSwap();

    svgRef.current?.animate(
      [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
      {
        duration: 400,
        easing: "ease-in-out",
        fill: "none",
      }
    );
  };

  return (
    <div className="filter-main-row one-way">
      {/* 출발지 */}
      <div className="filter-item">
        <label>출발지</label>
        <input
          placeholder="출발지 입력"
          value={depart}
          onChange={(e) => setDepart(e.target.value)}
        />
      </div>

      {/* 🔁 스위치 */}
      <button
        type="button"
        className="switch-icon"
        onClick={handleSwap}
        disabled={!depart || !arrive}
        aria-label="출발지와 도착지 교체"
      >
        <svg
          ref={svgRef}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 7H20M20 7L16 3M20 7L16 11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 17H4M4 17L8 21M4 17L8 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* 도착지 */}
      <div className="filter-item">
        <label>도착지</label>
        <input
          placeholder="도착지 입력"
          value={arrive}
          onChange={(e) => setArrive(e.target.value)}
        />
      </div>

      {/* 가는 편 */}
      <div
        className="filter-item date-box"
        onClick={onOpenCalendar}
        role="button"
        tabIndex={0}
      >
        <label>가는 편</label>
        <input
          readOnly
          tabIndex={-1}
          value={startDate ? format(startDate, "yyyy.MM.dd") : "연도-월-일"}
        />
      </div>

      {/* 검색 */}
      <button type="button" className="search-btn">
        검색
      </button>
    </div>
  );
};

export default OneWayTrip;

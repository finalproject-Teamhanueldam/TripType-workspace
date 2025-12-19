import "../../../css/filter/triptypes/RoundTrip.css";
import { useRef } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const RoundTrip = ({
  depart,
  arrive,
  setDepart,
  setArrive,
  startDate,
  endDate,
  onSwap,
  onOpenCalendar,
}) => {
  const svgRef = useRef(null);
  const navigate = useNavigate();

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

  /* 🔥 검색 버튼 클릭 */
  const handleSearch = () => {
    if (!depart || !arrive || !startDate || !endDate) return;

    const params = new URLSearchParams({
      tripType: "round",
      depart,
      arrive,
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    });

    // airlineNo는 아직 없으므로 임시값 0
    navigate(`/airline/detail/0?${params.toString()}`);
  };

  return (
    <div className="filter-main-row round-trip">
      {/* 출발지 */}
      <div className="filter-item">
        <label>출발지</label>
        <input
          placeholder="출발지 입력"
          value={depart}
          onChange={(e) => setDepart(e.target.value)}
        />
      </div>

      {/* 스위치 */}
      <div className="switch-wrapper">
        <button
          type="button"
          className="switch-icon"
          onClick={handleSwap}
          disabled={!depart || !arrive}
        >
          <svg
            ref={svgRef}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M4 7H20M20 7L16 3M20 7L16 11"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M20 17H4M4 17L8 21M4 17L8 13"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>

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
          value={startDate ? format(startDate, "yyyy.MM.dd") : "연도 - 월 - 일"}
        />
      </div>

      {/* 오는 편 */}
      <div
        className="filter-item date-box"
        onClick={onOpenCalendar}
        role="button"
        tabIndex={0}
      >
        <label>오는 편</label>
        <input
          readOnly
          tabIndex={-1}
          value={endDate ? format(endDate, "yyyy.MM.dd") : "연도 - 월 - 일"}
        />
      </div>

      {/* 🔍 검색 */}
      <button
        type="button"
        className="filter-section-search-btn"
        onClick={handleSearch}
      >
        검색
      </button>
    </div>
  );
};

export default RoundTrip;

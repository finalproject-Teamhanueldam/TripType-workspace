import "../../../css/filter/triptypes/OneWayTrip.css";
import { useRef } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";

import AirportInput from "../dropdown/AirportInput";

const OneWayTrip = ({
  depart,        // string (표시용)
  arrive,        // string (표시용)
  startDate,
  setDepart,     // (value: string) => void
  setArrive,     // (value: string) => void
  onSwap,
  onOpenCalendar,
  onSearch,
}) => {
  const svgRef = useRef(null);

  /* ===============================
     🔁 스왑
     =============================== */
  const handleSwap = () => {
    // ❌ 여기서 조건 판단하면 안 됨
    // 판단은 전부 부모(TripFilterContainer)에서
    onSwap();

    svgRef.current?.animate(
      [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
      { duration: 400, easing: "ease-in-out", fill: "none" }
    );
  };

  /* ===============================
     🔍 검색
     =============================== */
  const handleSearchClick = () => {
    if (!depart || !arrive) {
      toast.error("출발지와 도착지는 목록에서 선택해주세요");
      return;
    }

    if (!startDate) {
      toast.error("가는 편 날짜를 선택하세요");
      return;
    }

    onSearch();
  };

  return (
    <div className="filter-main-row one-way">
      {/* ===============================
          출발지
         =============================== */}
      <AirportInput
        label="출발지"
        value={depart}
        onChange={setDepart}
        onConfirm={setDepart}
      />

      {/* ===============================
          스위치
         =============================== */}
      <button
        type="button"
        className="switch-icon"
        onClick={handleSwap}
        disabled={!depart && !arrive}   // ✅ 둘 다 없을 때만 비활성화
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
          />
          <path
            d="M20 17H4M4 17L8 21M4 17L8 13"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </button>

      {/* ===============================
          도착지
         =============================== */}
      <AirportInput
        label="도착지"
        value={arrive}
        onChange={setArrive}
        onConfirm={setArrive}
      />

      {/* ===============================
          가는 편
         =============================== */}
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

      {/* ===============================
          검색
         =============================== */}
      <button
        type="button"
        className="filter-section-search-btn"
        onClick={handleSearchClick}
      >
        검색
      </button>
    </div>
  );
};

export default OneWayTrip;

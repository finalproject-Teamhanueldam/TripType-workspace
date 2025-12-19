import "../../../css/filter/triptypes/RoundTrip.css";
import { useRef } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";

import AirportInput from "../dropdown/AirportInput";

const RoundTrip = ({
  depart,
  arrive,
  setDepart,
  setArrive,
  startDate,
  endDate,
  onSwap,
  onOpenCalendar,
  onSearch,
}) => {
  const svgRef = useRef(null);

  /* ===============================
     🔁 스왑
     =============================== */
  const handleSwap = () => {
    // ❌ 여기서 출발/도착 체크하면 안 됨
    // 판단은 전부 부모(TripFilterContainer)가 한다
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

    if (!startDate || !endDate) {
      toast.error("가는 편, 오는 편 날짜를 선택하세요");
      return;
    }

    onSearch();
  };

  return (
    <div className="filter-main-row round-trip">
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
      <div className="switch-wrapper">
        <button
          type="button"
          className="switch-icon"
          onClick={handleSwap}
          disabled={!depart && !arrive}   // ✅ 둘 다 없을 때만 비활성화
        >
          <svg ref={svgRef} width="20" height="20" viewBox="0 0 24 24">
            <path d="M4 7H20M20 7L16 3M20 7L16 11" />
            <path d="M20 17H4M4 17L8 21M4 17L8 13" />
          </svg>
        </button>
      </div>

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
      <div className="filter-item date-box" onClick={onOpenCalendar}>
        <label>가는 편</label>
        <input
          readOnly
          value={startDate ? format(startDate, "yyyy.MM.dd") : "년도 - 월 - 일"}
        />
      </div>

      {/* ===============================
          오는 편
         =============================== */}
      <div className="filter-item date-box" onClick={onOpenCalendar}>
        <label>오는 편</label>
        <input
          readOnly
          value={endDate ? format(endDate, "yyyy.MM.dd") : "년도 - 월 - 일"}
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

export default RoundTrip;

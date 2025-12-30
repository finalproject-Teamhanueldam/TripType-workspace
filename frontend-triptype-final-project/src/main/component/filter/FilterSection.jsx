import { useState } from "react";
import "../../css/filter/FilterSection.css";

import TripFilterContainer from "./TripFilterContainer";
import PassengerFilter from "./PassengerFilter";
import TripTypeDropdown from "./TripTypeDropdown";
const FilterSection = () => {
  /* ===============================
     🔑 출발 / 도착
     =============================== */
  const [depart, setDepart] = useState("");
  const [arrive, setArrive] = useState("");

  /* ===============================
     🔑 여행 타입 (최상위 단일 진실)
     =============================== */
  const [tripType, setTripType] = useState("ROUND"); // ROUND | ONEWAY | MULTI

  /* ===============================
     🔑 인원 (좌석 수)
     =============================== */
  const [passengers, setPassengers] = useState({
    adult: 1,
    child: 0,
  });

  /* ===============================
     🔑 인원 팝업 열림 상태
     =============================== */
  const [passengerOpen, setPassengerOpen] = useState(false);

  const handleSwap = () => {
    if (!depart || !arrive) return;

    setDepart((prevDepart) => {
      setArrive(prevDepart);
      return arrive;
    });
  };

  const totalPassengers = passengers.adult + passengers.child;

  return (
    <div className="filter-container">
      {/* ===============================
          🔹 메타 영역 (여행 타입 + 인원)
         =============================== */}
      <div className="filter-meta">
        {/* 여행 타입 */}
        <div className="triptype-filter">
          <TripTypeDropdown
            value={tripType}
            onChange={setTripType}
          />
        </div>

        {/* 인원 요약 */}
        <div
          className="passenger-summary-box"
          onClick={(e) => {
            e.stopPropagation();
            setPassengerOpen(true);
          }}
        >
          여행자 {totalPassengers}명, 일반석
        </div>
      </div>

      {/* ===============================
          🔹 인원 팝업 (Popover)
         =============================== */}
      {passengerOpen && (
        <PassengerFilter
          passengers={passengers}
          setPassengers={setPassengers}
          onClose={() => setPassengerOpen(false)}
        />
      )}

      {/* ===============================
          🔹 여정 상세 필터
         =============================== */}
      <TripFilterContainer
        tripType={tripType}
        setTripType={setTripType}
        depart={depart}
        arrive={arrive}
        passengers={passengers}
        setDepart={setDepart}
        setArrive={setArrive}
        onSwap={handleSwap}
      />
    </div>
  );
};

export default FilterSection;

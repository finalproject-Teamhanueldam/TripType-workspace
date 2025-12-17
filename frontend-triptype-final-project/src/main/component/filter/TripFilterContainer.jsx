// TripFilterContainer.jsx
import { useState } from "react";
import CalendarPanel from "./CalendarPanel";
import RoundTrip from "./triptypes/RoundTrip";
import OneWayTrip from "./triptypes/OneWayTrip";
import MultiTrip from "./triptypes/MultiTrip";

const TripFilterContainer = ({
  tripType,          // 🔥 상위(FilterSection)에서 내려옴
  setTripType,       // 🔥 상위에서 내려옴

  depart,
  arrive,
  setDepart,
  setArrive,
  onSwap,
}) => {
  // round / oneway
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // multi
  const [segments, setSegments] = useState([
    {
      id: Date.now(),
      departure: "",
      arrival: "",
      date: null,
    },
  ]);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activeSegmentId, setActiveSegmentId] = useState(null);

  /* ===============================
     🔥 날짜 변경 로직 (중앙 집중)
     =============================== */
  const handleDateChange = (start, end) => {
    // MULTI
    if (tripType === "MULTI" && activeSegmentId !== null) {
      setSegments((prev) =>
        prev.map((seg) =>
          seg.id === activeSegmentId ? { ...seg, date: start } : seg
        )
      );
      return;
    }

    // reset
    if (!start && !end) {
      setStartDate(null);
      setEndDate(null);
      return;
    }

    // ONEWAY
    if (tripType === "ONEWAY") {
      setStartDate(start ?? null);
      setEndDate(null);
      return;
    }

    // ROUND
    if (start && !end) {
      setStartDate(start);
      setEndDate(null);
      return;
    }

    if (start && end) {
      setStartDate(start);
      setEndDate(end);
    }
  };

  /* ===============================
     🔥 타입 변경 (왕복 ↔ 편도 ↔ 다구간)
     =============================== */
  const handleTripTypeChange = (nextType) => {
    if (tripType === nextType) return;

    setTripType(nextType);

    // 공통 초기화
    setStartDate(null);
    setEndDate(null);
    setActiveSegmentId(null);

    if (nextType === "MULTI") {
      setSegments([
        {
          id: Date.now(),
          departure: "",
          arrival: "",
          date: null,
        },
      ]);
    }
  };

  /* ===============================
     🔥 달력 오픈
     =============================== */
  const openCalendarForSingle = () => {
    setActiveSegmentId(null);
    setCalendarOpen(true);
  };

  const openCalendarForMulti = (segmentId) => {
    setActiveSegmentId(segmentId);
    setCalendarOpen(true);
  };

  return (
    <>
      {/* ===============================
          🔹 여정 타입별 입력 UI
         =============================== */}
      {tripType === "ROUND" && (
        <RoundTrip
          depart={depart}
          arrive={arrive}
          setDepart={setDepart}
          setArrive={setArrive}
          startDate={startDate}
          endDate={endDate}
          onSwap={onSwap}
          onOpenCalendar={openCalendarForSingle}
        />
      )}

      {tripType === "ONEWAY" && (
        <OneWayTrip
          depart={depart}
          arrive={arrive}
          setDepart={setDepart}
          setArrive={setArrive}
          startDate={startDate}
          onSwap={onSwap}
          onOpenCalendar={openCalendarForSingle}
        />
      )}

      {tripType === "MULTI" && (
        <MultiTrip
          segments={segments}
          setSegments={setSegments}
          onOpenCalendar={openCalendarForMulti}
        />
      )}

      {/* ===============================
          🔹 달력 (단일 인스턴스)
         =============================== */}
      <CalendarPanel
        open={calendarOpen}
        tripType={tripType}
        onTripTypeChange={handleTripTypeChange}
        startDate={
          tripType === "MULTI"
            ? segments.find((s) => s.id === activeSegmentId)?.date ?? null
            : startDate
        }
        endDate={endDate}
        onChange={handleDateChange}
        onClose={() => setCalendarOpen(false)}
      />
    </>
  );
};

export default TripFilterContainer;

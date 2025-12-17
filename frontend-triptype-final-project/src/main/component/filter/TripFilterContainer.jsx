// TripFilterContainer.jsx
import { useState } from "react";
import CalendarPanel from "./CalendarPanel";
import RoundTrip from "./triptypes/RoundTrip";
import OneWayTrip from "./triptypes/OneWayTrip";
import MultiTrip from "./triptypes/MultiTrip";

const TripFilterContainer = ({
  depart,
  arrive,
  setDepart,
  setArrive,
  onSwap,
}) => {
  /* ===============================
     🔑 단일 진실
     =============================== */
  const [tripType, setTripType] = useState("round"); // round | oneway | multi

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
    // multi
    if (tripType === "multi" && activeSegmentId !== null) {
      setSegments((prev) =>
        prev.map((seg) =>
          seg.id === activeSegmentId ? { ...seg, date: start } : seg
        )
      );
      return;
    }

    // 날짜 초기화
    if (!start && !end) {
      setStartDate(null);
      setEndDate(null);
      return;
    }

    // oneway
    if (tripType === "oneway") {
      setStartDate(start ?? null);
      setEndDate(null);
      return;
    }

    // round
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
     🔥 타입 변경
     =============================== */
  const handleTripTypeChange = (nextType) => {
    if (tripType === nextType) return;

    setTripType(nextType);

    // 날짜 리셋
    setStartDate(null);
    setEndDate(null);
    setActiveSegmentId(null);

    if (nextType === "multi") {
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
     🔥 달력 오픈 핸들러
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
          🔹 상단 필터 UI
         =============================== */}
      {tripType === "round" && (
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

      {tripType === "oneway" && (
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

      {tripType === "multi" && (
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
        mode={tripType === "multi" ? "oneway" : tripType}
        startDate={
          tripType === "multi"
            ? segments.find((s) => s.id === activeSegmentId)?.date ?? null
            : startDate
        }
        endDate={endDate}
        onModeChange={handleTripTypeChange}
        onChange={handleDateChange}
        onClose={() => setCalendarOpen(false)}
      />
    </>
  );
};

export default TripFilterContainer;

// TripFilterContainer.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "react-toastify";

import CalendarPanel from "./CalendarPanel";
import RoundTrip from "./triptypes/RoundTrip";
import OneWayTrip from "./triptypes/OneWayTrip";
import MultiTrip from "./triptypes/MultiTrip";

import { AIRPORTS } from "../data/Airports";

const TripFilterContainer = ({tripType, setTripType}) => {
  const navigate = useNavigate();

  /* ===============================
     🔹 선택된 공항 (객체)
     =============================== */
  const [depart, setDepart] = useState(null); // { label, iata }
  const [arrive, setArrive] = useState(null);

  /* ===============================
     🔹 input 표시용 문자열
     =============================== */
  const [departInput, setDepartInput] = useState("");
  const [arriveInput, setArriveInput] = useState("");

  /* ===============================
     🔹 승객 수
     =============================== */
  const [adultCount, setAdultCount] = useState(1);
  const [minorCount, setMinorCount] = useState(0);

  /* ===============================
     🔹 날짜
     =============================== */
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  /* ===============================
     🔹 MULTI
     =============================== */
  const [segments, setSegments] = useState([
    {
      id: Date.now(),
      depart: null,
      arrive: null,
      date: null,
    },
  ]);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activeSegmentId, setActiveSegmentId] = useState(null);


  /* ===============================
     🔹 공항 매칭
     =============================== */
  const findAirport = (value) => {
    if (!value) return null;

    return (
      AIRPORTS.find(
        (a) =>
          a.label === value ||
          a.iata.toLowerCase() === value.toLowerCase()
      ) ?? null
    );
  };

  /* ===============================
     🔹 출발지 입력
     =============================== */
  const handleDepartInput = (value) => {
    setDepartInput(value);
    setDepart(findAirport(value));
  };

  /* ===============================
     🔹 도착지 입력
     =============================== */
  const handleArriveInput = (value) => {
    setArriveInput(value);
    setArrive(findAirport(value));
  };

  /* ===============================
     🔥 🔥 🔥 출발지 ↔ 도착지 스왑 (정상 버전)
     =============================== */
  const handleSwap = () => {
    // 둘 다 없을 때만 막는다
    if (!departInput && !arriveInput) return;

    const nextDepartInput = arriveInput;
    const nextArriveInput = departInput;

    const nextDepart = arrive;
    const nextArrive = depart;

    setDepartInput(nextDepartInput);
    setArriveInput(nextArriveInput);

    setDepart(nextDepart);
    setArrive(nextArrive);
  };

  /* ===============================
     🔹 날짜 변경
     =============================== */
  const handleDateChange = (start, end) => {
    if (tripType === "MULTI" && activeSegmentId !== null) {
      setSegments((prev) =>
        prev.map((seg) =>
          seg.id === activeSegmentId ? { ...seg, date: start } : seg
        )
      );
      return;
    }

    if (tripType === "ONEWAY") {
      setStartDate(start ?? null);
      setEndDate(null);
      return;
    }

    setStartDate(start ?? null);
    setEndDate(end ?? null);
  };

  /* ===============================
     🔍 검색 실행
     =============================== */
  const handleSearch = async (searchParams) => {
    // console.log(searchParams);
    // 필터링 조건들...

    // 🔹 API 설정
    const url = "http://localhost:8001/triptype/api/flights/search";
    const method = "post";

    try {
      const res = await axios({
        url,
        method,
        data: searchParams,
      });

      console.log(searchParams);
      console.log(res);

      navigate("/airline/list", {
        state: {
          searchParams : searchParams,
          res : res.data
        },
      });
    } catch (err) {
      console.error("항공권 검색 API 오류:", err);
      toast.error("항공권 검색 중 오류가 발생했습니다.");
    }
  };


  return (
    <>
      {tripType === "ROUND" && (
        <RoundTrip
          depart={departInput}
          arrive={arriveInput}
          setDepart={handleDepartInput}
          setArrive={handleArriveInput}
          startDate={startDate}
          endDate={endDate}
          onSwap={handleSwap}
          onOpenCalendar={() => {
            setActiveSegmentId(null);
            setCalendarOpen(true);
          }}
          onSearch={() =>
            handleSearch({
              tripType: "ROUND",
              depart: depart?.iata,
              arrive: arrive?.iata,
              departDate: startDate
                ? format(startDate, "yyyy-MM-dd")
                : null,
              returnDate: endDate
                ? format(endDate, "yyyy-MM-dd")
                : null,
              adultCount,
              minorCount,
            })
          }
        />
      )}

      {tripType === "ONEWAY" && (
        <OneWayTrip
          depart={departInput}
          arrive={arriveInput}
          setDepart={handleDepartInput}
          setArrive={handleArriveInput}
          startDate={startDate}
          onSwap={handleSwap}
          onOpenCalendar={() => {
            setActiveSegmentId(null);
            setCalendarOpen(true);
          }}
          onSearch={() =>
            handleSearch({
              tripType: "ONEWAY",
              depart: depart?.iata,
              arrive: arrive?.iata,
              departDate: startDate
                ? format(startDate, "yyyy-MM-dd")
                : null,
              adultCount,
              minorCount,
            })
          }
        />
      )}

      {tripType === "MULTI" && (
        <MultiTrip
          segments={segments}
          setSegments={setSegments}
          onOpenCalendar={(id) => {
            setActiveSegmentId(id);
            setCalendarOpen(true);
          }}
          onSearch={() =>
            handleSearch({
              tripType: "MULTI",
              adultCount,
              minorCount,
              segments: segments.map((seg) => ({
                depart: seg.depart?.iata,
                arrive: seg.arrive?.iata,
                date: seg.date
                  ? format(seg.date, "yyyy-MM-dd")
                  : null,
              })),
            })
          }
        />
      )}

      <CalendarPanel
        open={calendarOpen}
        tripType={tripType}
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

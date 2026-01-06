// TripFilterContainer.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "react-toastify";

import CalendarPanel from "./CalendarPanel";
import RoundTrip from "./triptypes/RoundTrip";
import OneWayTrip from "./triptypes/OneWayTrip";
import MultiTrip from "./triptypes/MultiTrip";

import { AIRPORTS } from "../data/Airports";

const TripFilterContainer = ({ tripType, setTripType, passengers }) => {

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  // ✅ CalendarPanel을 "기준 컨테이너" 안에서 absolute로 정확히 위치시키기 위한 래퍼
  const containerRef = useRef(null);

  /* ===============================
     🔹 선택된 공항 (객체) - ROUND/ONEWAY 전용
     =============================== */
  const [depart, setDepart] = useState(null); // { label, iata }
  const [arrive, setArrive] = useState(null);

  /* ===============================
     🔹 input 표시용 문자열 - ROUND/ONEWAY 전용
     =============================== */
  const [departInput, setDepartInput] = useState("");
  const [arriveInput, setArriveInput] = useState("");

  /* ===============================
     🔹 날짜 - ROUND/ONEWAY 전용
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

  /* ===============================
     🔹 Calendar (공용)
     =============================== */
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activeSegmentId, setActiveSegmentId] = useState(null);

  // ✅ MULTI에서만: 클릭된 날짜 input 바로 아래에 달력 띄우기 위한 앵커/스타일
  const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
  const [calendarStyle, setCalendarStyle] = useState(null);

  /* ===============================
     ✅ (추가) MULTI 날짜 단조 증가 보정
     - i번째 date는 i-1번째 date보다 빠를 수 없음
     - 앞 구간 날짜가 뒤로 이동하면, 뒤 구간들도 연쇄적으로 끌어올림
     =============================== */
  const normalizeMultiDates = (list = []) => {
    const next = list.map((s) => ({ ...s }));

    for (let i = 1; i < next.length; i++) {
      const prevDate = next[i - 1]?.date;
      const currDate = next[i]?.date;

      if (prevDate && currDate && currDate < prevDate) {
        next[i].date = prevDate;
      }
    }

    return next;
  };

  /* ===============================
     🔹 공항 매칭
     =============================== */
  const findAirport = (value) => {
    if (!value) return null;

    return (
      AIRPORTS.find(
        (a) => a.label === value || a.iata.toLowerCase() === value.toLowerCase()
      ) ?? null
    );
  };

  /* ===============================
     🔹 출발지 입력 (ROUND/ONEWAY)
     =============================== */
  const handleDepartInput = (value) => {
    setDepartInput(value);
    setDepart(findAirport(value));
  };

  /* ===============================
     🔹 도착지 입력 (ROUND/ONEWAY)
     =============================== */
  const handleArriveInput = (value) => {
    setArriveInput(value);
    setArrive(findAirport(value));
  };

  /* ===============================
     🔥 출발지 ↔ 도착지 스왑 (ROUND/ONEWAY)
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
     ✅ MULTI 달력 위치 계산 (input 바로 아래)
     =============================== */
  const computeMultiCalendarStyle = (anchorEl) => {
    const containerEl = containerRef.current;
    if (!anchorEl || !containerEl) return null;

    const a = anchorEl.getBoundingClientRect();
    const c = containerEl.getBoundingClientRect();

    // container 내부 좌표로 변환
    const top = a.bottom - c.top + (containerEl.scrollTop || 0) + 8;
    const left = a.left - c.left + (containerEl.scrollLeft || 0);

    // 우측 overflow 방지(간단 클램프)
    const containerWidth = containerEl.clientWidth || 0;
    const desiredWidth = Math.min(860, containerWidth);
    const maxLeft = Math.max(0, containerWidth - desiredWidth);
    const clampedLeft = Math.min(Math.max(0, left), maxLeft);

    return {
      position: "absolute",
      top,
      left: clampedLeft,
      transform: "none",
      width: desiredWidth,
      maxWidth: desiredWidth,
      zIndex: 100,
    };
  };

  // ✅ MULTI에서 열려있는 동안 스크롤/리사이즈/레이아웃 변화에 위치 재계산
  useEffect(() => {
    if (!calendarOpen) return;
    if (tripType !== "MULTI") return;
    if (!calendarAnchorEl) return;

    const reposition = () => {
      const next = computeMultiCalendarStyle(calendarAnchorEl);
      if (next) setCalendarStyle(next);
    };

    reposition();

    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true); // 버블링/캡처 환경 포함

    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [calendarOpen, tripType, calendarAnchorEl]);

  /* ===============================
     🔹 날짜 변경
     =============================== */
  const handleDateChange = (start, end) => {
    // MULTI: 특정 세그먼트 날짜만 바꿈
    if (tripType === "MULTI" && activeSegmentId != null) {
      // ✅ 변경: 특정 세그먼트 date 설정 후 "단조 증가" 연쇄 보정
      setSegments((prev) => {
        const mapped = prev.map((seg) =>
          seg.id === activeSegmentId ? { ...seg, date: start } : seg
        );
        return normalizeMultiDates(mapped);
      });
      return;
    }

    // ONEWAY
    if (tripType === "ONEWAY") {
      setStartDate(start ?? null);
      setEndDate(null);
      return;
    }

    // ROUND
    setStartDate(start ?? null);
    setEndDate(end ?? null);
  };

  const validateRoundOneWayAirports = () => {
    // 1) 드롭다운에서 선택(매칭)된 공항 객체가 있어야 함
    if (!depart?.iata || !arrive?.iata) {
      toast.error("출발지/도착지는 드롭다운에서 선택해 주세요.");
      return false;
    }

    // 2) 입력창 문자열이 '선택된 공항 label'과 정확히 같아야 함
    // (사용자가 타이핑으로 바꿔치기하면 막음)
    if (departInput !== depart.label || arriveInput !== arrive.label) {
      toast.error("출발지/도착지는 목록에서 선택한 값만 가능합니다.");
      return false;
    }

    // 3) 동일 공항 방지(선택)
    if (depart.iata === arrive.iata) {
      toast.error("출발지와 도착지는 같을 수 없습니다.");
      return false;
    }

    return true;
  };

  /* ===============================
     🔍 검색 실행
     =============================== */
  // const handleSearch = (searchParams) => {
  //   navigate("/airline/list", {
  //     state: { searchParams },
  //   });

  //   axios
  //     .post("http://localhost:8001/triptype/api/flights/search", searchParams)
  //     .catch((err) => {
  //       console.error("검색 DB 저장 실패:", err);
  //   });
  // };

  const handleSearch = async (searchParams) => {
    try {
      // ✅ JWT 토큰 꺼내기 (저장 위치/키는 너희 프로젝트에 맞게)
      // 예: localStorage, sessionStorage, zustand, recoil 등
      const token = localStorage.getItem("accessToken"); // <-- 키 이름 맞추기

      const { data } = await axios.post(
        `${API_BASE_URL}/api/flights/search`,
        searchParams,
        {
          // ✅ 로그인 상태면 Authorization 헤더 전송
          // ✅ 비로그인이면 token이 null이므로 헤더 없이 요청
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      // ✅ data는 { searchId }
      const { searchId } = data;

      navigate("/airline/list", {
        state: {
          searchParams,
          searchId,
        },
      });

    } catch (err) {
      console.error("검색 실패:", err);
    }
  };




  /* ===============================
     ✅ MULTI payload 정규화
     =============================== */
  const buildMultiPayload = () => {
    if (!segments || segments.length === 0) {
      toast.error("다구간 노선을 1개 이상 추가해 주세요.");
      return null;
    }

    const first = segments[0];
    if (!first?.depart?.iata) {
      toast.error("첫 번째 노선의 출발지를 선택해 주세요.");
      return null;
    }

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];

      if (!seg?.arrive?.iata) {
        toast.error(`${i + 1}번째 노선의 도착지를 선택해 주세요.`);
        return null;
      }

      if (!seg?.date) {
        toast.error(`${i + 1}번째 노선의 날짜를 선택해 주세요.`);
        return null;
      }

      if (i > 0) {
        const prevArrive = segments[i - 1]?.arrive?.iata;
        if (!prevArrive) {
          toast.error(`${i}번째 노선의 도착지를 먼저 선택해 주세요.`);
          return null;
        }
      }
    }

    const normalizedSegments = segments.map((seg, idx) => {
      const departIata =
        idx === 0
          ? seg.depart?.iata ?? null
          : segments[idx - 1]?.arrive?.iata ?? null;

      const arriveIata = seg.arrive?.iata ?? null;
      const d = seg.date ? format(seg.date, "yyyy-MM-dd") : null;

      return {
        depart: departIata,
        arrive: arriveIata,
        date: d,
      };
    });

    const last = segments[segments.length - 1];

    const departIata = normalizedSegments[0]?.depart ?? null;
    const arriveIata =
      normalizedSegments[normalizedSegments.length - 1]?.arrive ?? null;

    const departDate = segments[0]?.date
      ? format(segments[0].date, "yyyy-MM-dd")
      : null;

    const returnDate = last?.date ? format(last.date, "yyyy-MM-dd") : null;

    if (!departDate) {
      toast.error("첫 번째 노선 날짜가 비어 있습니다.");
      return null;
    }
    if (!returnDate) {
      toast.error("마지막 노선 날짜가 비어 있습니다.");
      return null;
    }

    return {
      tripType: "MULTI",
      adultCount: passengers?.adult ?? 1,
      minorCount: passengers?.child ?? 0,

      depart: departIata,
      arrive: arriveIata,
      departDate,
      returnDate,

      segments: normalizedSegments,
    };
  };

  /* ===============================
     ✅ 달력 열기/닫기
     =============================== */
  const openRoundOneWayCalendar = () => {
    setActiveSegmentId(null);
    setCalendarAnchorEl(null);
    setCalendarStyle(null);
    setCalendarOpen(true);
  };

  // ✅ MULTI: (id, el)로 받으면 "그 input 아래"에 달력 위치 잡음
  const openMultiCalendar = (id, el) => {
    setActiveSegmentId(id);

    if (el) {
      setCalendarAnchorEl(el);
      const nextStyle = computeMultiCalendarStyle(el);
      setCalendarStyle(nextStyle);
    } else {
      setCalendarAnchorEl(null);
      setCalendarStyle(null);
    }

    setCalendarOpen(true);
  };

  const closeCalendar = () => {
    setCalendarOpen(false);
    setActiveSegmentId(null);
    setCalendarAnchorEl(null);
    setCalendarStyle(null);
  };

  const multiSelectedDate = useMemo(() => {
    if (tripType !== "MULTI") return null;
    return segments.find((s) => s.id === activeSegmentId)?.date ?? null;
  }, [tripType, segments, activeSegmentId]);

  /* ===============================
     ✅ 달력 내부 드롭다운(왕복/편도) 변경 시 바깥 UI도 같이 바뀌게 복구
     - MULTI는 CalendarPanel에서 셀렉트가 숨겨져 있으니 영향 없음
     - ROUND <-> ONEWAY만 처리 (기존 동작 복구)
     =============================== */
  const handleTripTypeChangeFromCalendar = (nextType) => {
    // 혹시 값이 이상하게 오면 방어
    if (nextType !== "ROUND" && nextType !== "ONEWAY") return;

    setTripType(nextType);

    // ROUND/ONEWAY는 세그먼트 관련 상태 정리(다른 쪽 영향 방지)
    setActiveSegmentId(null);
    setCalendarAnchorEl(null);
    setCalendarStyle(null);

    // 편도 전환 시 왕복 종료일은 제거 (기존 UX 복구)
    if (nextType === "ONEWAY") {
      setEndDate(null);
    }

    // 달력은 계속 열어두는 게 예전 동작이면 유지
    // 닫고 싶으면 아래 주석 해제
    // setCalendarOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {tripType === "ROUND" && (
        <RoundTrip
          depart={departInput}
          arrive={arriveInput}
          setDepart={handleDepartInput}
          setArrive={handleArriveInput}
          startDate={startDate}
          endDate={endDate}
          onSwap={handleSwap}
          onOpenCalendar={openRoundOneWayCalendar}
          onSearch={() => {
            if (!validateRoundOneWayAirports()) return;

            handleSearch({
              tripType: "ROUND",
              depart: depart?.iata,
              arrive: arrive?.iata,
              departDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
              returnDate: endDate ? format(endDate, "yyyy-MM-dd") : null,
              adultCount: passengers?.adult ?? 1,
              minorCount: passengers?.child ?? 0,
            });
          }}
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
          onOpenCalendar={openRoundOneWayCalendar}
          onSearch={() => {
            if (!validateRoundOneWayAirports()) return;

            handleSearch({
              tripType: "ONEWAY",
              depart: depart?.iata,
              arrive: arrive?.iata,
              departDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
              adultCount: passengers?.adult ?? 1,
              minorCount: passengers?.child ?? 0,
            });
          }}
        />
      )}

      {tripType === "MULTI" && (
        <MultiTrip
          segments={segments}
          setSegments={setSegments}
          onOpenCalendar={(id, el) => openMultiCalendar(id, el)}
          onSearch={() => {
            const payload = buildMultiPayload();
            if (!payload) return;
            handleSearch(payload);
          }}
        />
      )}

      <CalendarPanel
        open={calendarOpen}
        tripType={tripType}
        onTripTypeChange={handleTripTypeChangeFromCalendar} // ✅ 이거 추가가 핵심
        startDate={tripType === "MULTI" ? multiSelectedDate : startDate}
        endDate={endDate}
        onChange={handleDateChange}
        onClose={closeCalendar}
        style={tripType === "MULTI" ? calendarStyle : undefined}
      />
    </div>
  );
};

export default TripFilterContainer;

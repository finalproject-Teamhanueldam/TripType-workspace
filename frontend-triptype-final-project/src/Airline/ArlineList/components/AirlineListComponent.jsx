import "../css/AirlineListComponent.css";
import TicketBoxComponent from "../../common/TicketBoxComponent.jsx";
import AlertChartListComponent from "./AlertChartListComponent.jsx";
import AirlineModalComponent from "./AirlineModalComponent.jsx";
import WeekPriceList from "./WeekPriceListComponent.jsx";

import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AirlineListComponent = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state || {};
  const { searchParams, res, searchId } = locationState;

  // State
  const [selectedPair, setSelectedPair] = useState(null);
  const [open, setOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(0); 
  const [activeTransit, setActiveTransit] = useState([]);
  const [departureTime, setDepartureTime] = useState(0);
  const [airlineStatus, setAirlineStatus] = useState(null); // 선택된 항공사 명
  const [outboundList, setOutboundList] = useState([]);
  const [roundList, setRoundList] = useState([]);
  const [result, setResult] = useState(0);
  const [airline, setAirline] = useState([]); // 항공사 버튼 목록용

  // Ref (Polling 관리)
  const pollTimerRef = useRef(null);
  const isPollingRef = useRef(false);

  // 상수 데이터
  const filterList = ["최저가", "비행시간순", "늦은출발"];
  const transitList = ["직항", "1회 경유", "2회 이상"];
  const sortType = activeFilter === 0 ? "PRICE" : activeFilter === 1 ? "DURATION" : "LATE";

  // 모달 열기 함수
  const handleOpenModal = (pair) => {
    setSelectedPair(pair);
    setOpen(true);
  };

  /* =========================================================
      ✅ 데이터 가공 및 상태 업데이트
  ========================================================= */
  const applyFlights = (allFlights) => {
    console.log("✅ applyFlights 데이터 수신:", allFlights?.length, "건");

    if (!Array.isArray(allFlights) || allFlights.length === 0) {
      setAirline([]);
      setResult(0);
      return;
    }

    // 1. 항공사 목록 추출 (과거 코드 방식 + 방어 로직)
    const uniqueAirlines = Array.from(
      new Set(
        allFlights
          .map((f) => f.airlineName || f.airlineNm || f.carrierName)
          .filter(Boolean)
      )
    );
    console.log("✈️ 추출된 항공사 목록:", uniqueAirlines);
    console.log('all', allFlights);
    setAirline(uniqueAirlines);

    // 2. 왕복 데이터를 위한 그룹화
    const pairedMap = new Map();
    allFlights.forEach((flight) => {
      const id = flight.flightOfferId;
      if (!pairedMap.has(id)) {
        pairedMap.set(id, { outbound: null, inbound: null });
      }

      const current = pairedMap.get(id);
      if (flight.departAirportCode === searchParams?.depart) {
        current.outbound = flight;
      } else {
        current.inbound = flight;
      }
    });

    let pairedArray = Array.from(pairedMap.values());

    // 3. 정렬 로직
    const parseISOToMin = (iso) => {
      if (!iso) return 0;
      const hours = iso.match(/(\d+)H/) ? parseInt(iso.match(/(\d+)H/)[1]) : 0;
      const minutes = iso.match(/(\d+)M/) ? parseInt(iso.match(/(\d+)M/)[1]) : 0;
      return hours * 60 + minutes;
    };

    if (sortType === "DURATION") {
      pairedArray.sort((a, b) => 
        parseISOToMin(a.outbound?.flightDuration) - parseISOToMin(b.outbound?.flightDuration)
      );
    } else if (sortType === "LATE") {
      pairedArray.sort((a, b) => 
        new Date(b.outbound?.departDate) - new Date(a.outbound?.departDate)
      );
    }

    // 4. 상태 저장
    if (searchParams?.tripType === "ROUND") {
      setRoundList(pairedArray);
    } else {
      setOutboundList(pairedArray);
    }
    setResult(pairedArray.length);
  };

  /* =========================================================
      ✅ Polling 함수
  ========================================================= */
  const pollSearchResult = async () => {
    if (!searchId || isPollingRef.current) return;
    isPollingRef.current = true;

    const url = `http://localhost:8001/triptype/api/flights/search/${searchId}`;

    const poll = async () => {
      try {
        const response = await axios.get(url);
        if (response.status === 202 || !Array.isArray(response.data)) {
          console.log("⏳ 데이터 로딩 중 (PENDING)...");
          pollTimerRef.current = setTimeout(poll, 1000); // 1초 간격 재시도
          return;
        }

        applyFlights(response.data);
        isPollingRef.current = false;
        if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      } catch (error) {
        console.error("❌ Polling 실패:", error);
        isPollingRef.current = false;
      }
    };
    poll();
  };

  useEffect(() => {
    if (!searchParams) {
      toast.info("검색 조건이 없습니다. 메인으로 이동합니다.");
      navigate("/");
      return;
    }

    const renderCall = async () => {
      if (Array.isArray(res) && res.length > 0) {
        applyFlights(res);
        return;
      }
      if (searchId) {
        pollSearchResult();
        return;
      }
      try {
        const response = await axios.get("http://localhost:8001/triptype/airline/list", {
          params: { ...searchParams, sortType },
        });
        applyFlights(response.data);
      } catch (error) {
        console.error("데이터 로딩 오류:", error);
      }
    };

    renderCall();

    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      isPollingRef.current = false;
    };
  }, [activeFilter, searchParams, sortType, res, searchId, navigate]);

  // 핸들러 함수들
  const changeFilter = (index) => setActiveFilter(index);
  const changeTransit = (index) => {
    const target = transitList[index];
    setActiveTransit(prev => prev.includes(target) ? prev.filter(i => i !== target) : [...prev, target]);
  };
  const changeTime = (value) => setDepartureTime(Number(value));
  
  // 항공사 필터 선택/해제 로직 강화
  const changeAirline = (name) => {
    setAirlineStatus(prev => prev === name ? null : name);
  };

  const hour = String(Math.floor(departureTime / 60)).padStart(2, "0");
  const minute = String(departureTime % 60).padStart(2, "0");

  const goDetail = (pair) => {
    const flightOfferId = pair.outbound?.flightOfferId || pair.inbound?.flightOfferId;
    if (!flightOfferId) return toast.info("존재하지 않는 항공권입니다.");
    navigate(`/airline/detail/${flightOfferId}`, {
      state: {
        outbound: pair.outbound,
        inbound: pair.inbound,
        tripType: searchParams?.tripType,
      },
    });
  };

  // UI에서 사용될 필터링된 리스트
  const getFilteredList = () => {
    const baseList = searchParams?.tripType === "ROUND" ? roundList : outboundList;
    return baseList.filter(pair => {
      if (!pair.outbound) return false;
      // 항공사 필터 적용
      if (airlineStatus && pair.outbound.airlineName !== airlineStatus) return false;
      // 출발 시간대 필터 (예시: 00:00 ~ 설정시간까지)
      // (로직 추가 필요 시 여기에 작성)
      return true;
    });
  };

  const filteredData = getFilteredList();

  return (
    <div className="airline-list-wrapper">
      <section className="price-table-wrapper">
        <WeekPriceList setActiveFilter={setActiveFilter} searchParams={searchParams} />
      </section>

      <div className="airline-list">
        <aside className="side-1">
          <div className="filter-card">
            <div className="filter-section">
              <strong>경유</strong>
              {transitList.map((item, index) => (
                <label key={index}>
                  <input type="checkbox" value={item} onChange={() => changeTransit(index)} />{item}
                </label>
              ))}
            </div>

            <div className="filter-section">
              <strong>출발 시간대</strong>
              <p>오전 00:00 - 오후 {hour}:{minute}</p>
              <input type="range" min="0" max="1440" step="5" onChange={(e) => changeTime(e.target.value)} />
            </div>

            <div className="filter-section">
              <strong>항공사</strong>
              <div className="airline-btns">
                {airline.length > 0 ? (
                  airline.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => changeAirline(item)}
                      className={airlineStatus === item ? "active" : ""}
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <p style={{fontSize: '12px', color: '#999'}}>항공사 정보를 불러오는 중...</p>
                )}
              </div>
            </div>
          </div>
        </aside>

        <AirlineModalComponent 
          open={open} 
          onClose={() => { setOpen(false); setSelectedPair(null); }} 
          pair={selectedPair} 
        />

        <main>
          <div className="airline-ticket-sort">
            <div className="sort-tabs">
              <span className={activeFilter === 0 ? "active" : ""} onClick={() => changeFilter(0)}>최저가</span>
              <span className={activeFilter === 1 ? "active" : ""} onClick={() => changeFilter(1)}>비행시간순</span>
            </div>
            <select value={activeFilter} onChange={(e) => setActiveFilter(Number(e.target.value))}>
              {filterList.map((item, index) => <option key={index} value={index}>{item}</option>)}
            </select>
          </div>

          <p className="result-count">
            {filteredData.length}개의 검색 결과 · 
            <span className="price-check" onClick={() => navigate("/airline/list/price")}> 가격변동 조회</span>
          </p>

          {filteredData.length > 0 ? (
            filteredData.map((pair, index) => (
              <TicketBoxComponent
                key={index}
                segment={pair.outbound}
                returnSegment={pair.inbound}
                tripType={searchParams?.tripType}
                setOpen={() => handleOpenModal(pair)}
                showPlus={pair.outbound?.tripType !== "Y"}
                onClick={() => goDetail(pair)}
              />
            ))
          ) : (
            <div className="no-result">검색 결과가 없습니다.</div>
          )}
        </main>

        <aside className="side-2">
          <AlertChartListComponent />
        </aside>
      </div>
    </div>
  );
};

export default AirlineListComponent;
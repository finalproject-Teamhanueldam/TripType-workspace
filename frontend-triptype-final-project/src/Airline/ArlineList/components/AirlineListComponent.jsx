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
  const [departureTime, setDepartureTime] = useState(1440);
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



  const matchTransit = (segment) => {
    if (!segment || segment.flightSegmentNo === undefined) return false;

    // 아무 것도 선택 안 했으면 전체 허용 (초기 상태)
    if (activeTransit.length === 0) return true;

    const count = segment.flightSegmentNo;
    const selected = activeTransit[0]; // 어차피 하나만 들어있음

    if (selected === "직항") return count === 0;
    if (selected === "1회 경유") return count === 1;
    if (selected === "2회 이상") return count >= 2;

    return true;
  };


  const getDepartMinutes = (dateString) => {
    if (!dateString) return 0;
    const date = new Date(dateString);
    return date.getHours() * 60 + date.getMinutes();
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
    // 항공사 목록 업데이트
    const airlines = Array.from(
      new Set(allFlights.map((f) => f.airlineName).filter(Boolean))
    );
    setAirline(airlines);

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

        console.log("결과 ㅇㅇ : ", response.data);

        applyFlights(response.data);
        console.log("alllll", response.data);
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
    setActiveTransit([target]); // 기존 데이터를 지우고 새 선택값만 배열에 담음
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


const getFilteredList = () => {
  const baseList =
    searchParams?.tripType === "ROUND" ? roundList : outboundList;

  return baseList.filter(pair => {
    const outbound = pair.outbound;
    if (!outbound) return false;

    // 항공사 필터
    if (airlineStatus && outbound.airlineName !== airlineStatus) return false;

    // 경유 필터
    if (!matchTransit(outbound)) return false;

    // 출발 시간대 필터
    const departMinutes = getDepartMinutes(outbound.departDate);
    if (departMinutes > departureTime) return false;

    return true;
  });
};




  const filteredData = getFilteredList();

  console.log("트립 타입", searchParams.tripType);

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
                  <input type="radio" name="segment-option" value={item} onChange={() => changeTransit(index)} />{item}
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
                <button
                  onClick={() => setAirlineStatus(null)}
                  className={airlineStatus === null ? "active" : ""}
                >
                  모두
                </button>
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
            <span className="price-check" onClick={() => navigate("/airline/list/price", { state : { searchParams : searchParams } })}> 가격변동 조회</span>
          </p>
          {
            filteredData.map((pair, index) => (
              <TicketBoxComponent
                key={index}
                segment={pair.outbound}
                returnSegment={
                  searchParams?.tripType === "ROUND" ? pair.inbound : null
                }
                tripType={searchParams?.tripType}
                setOpen={() => handleOpenModal(pair)}
                showPlus={searchParams?.tripType === "ROUND"}
                onClick={() => goDetail(pair)}
              />
            ))
          }


          {/* {
            searchParams?.tripType === "ROUND" ? (
              roundList.map((pair, index) => (
                <TicketBoxComponent
                  key={index}
                  segment={pair.outbound}          // 가는 편
                  returnSegment={pair.inbound}     // 오는 편
                  tripType={searchParams.tripType} // ⭐ 검색 기준으로 고정
                  setOpen={() => handleOpenModal(pair)}
                  showPlus={true}                  // 왕복이면 항상 +
                  onClick={() => goDetail(pair)}   // pair 그대로 전달
                />
              ))
            ) : searchParams?.tripType === "ONEWAY" ? (
              outboundList
                .filter(pair => pair.outbound)    // 방어
                .map((pair, index) => (
                  <TicketBoxComponent
                    key={index}
                    segment={pair.outbound}
                    returnSegment={null}           // ⭐ 편도는 inbound 없음
                    tripType={searchParams.tripType}
                    setOpen={() => handleOpenModal(pair)}
                    showPlus={false}
                    onClick={() => goDetail(pair)}
                  />
                ))
            ) : null
          } */}

        </main>

        <aside className="side-2">
          <AlertChartListComponent 
          />
        </aside>
      </div>
    </div>
  );
};

export default AirlineListComponent;
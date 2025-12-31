import "../css/AirlineListComponent.css";
import TicketBoxComponent from "../../common/TicketBoxComponent.jsx";
import AlertChartListComponent from "./AlertChartListComponent.jsx"
import AirlineModalComponent from "./AirlineModalComponent.jsx";
import WeekPriceList from "./WeekPriceListComponent.jsx";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AirlineListComponent = () => {

  const navigate = useNavigate();

  // 검색 조건을 담은 location 객체
  const location = useLocation().state;
  const { searchParams, res } = location;

  console.log(searchParams);




  // 필터
  const filterList = ["최저가", "비행시간순", "늦은출발"];


  // 경유 필터
  const transitList = ["직항", "1회 경유", "2회 이상"];



  // State
  // 필터링 Status (최저가 / 비행시간순)
  const [ activeFilter, setActiveFilter ] = useState(0);

  // 경유 필터
  const [ activeTransit, setActiveTransit ] = useState([]);

  // 출발 시간대
  const [ departureTime, setDepartureTime ] = useState(0);

  // 항공사
  const [ airlineStatus, setAirlineStatus ] = useState();

  // 모달창 (왕복, 경유일 경우)
  const [ open, setOpen ] = useState(false);

  // 백엔드에서 받아온 결과
  // 편도 전용
  const [outboundList, setOutboundList] = useState([]); // 가는 편
  const [inboundList, setInboundList] = useState([]);   // 오는 편

  // 왕복 전용
  const [ roundList, setRoundList ] = useState([]); // 왕복 (가는 편/오는 편)

  const [ result, setResult ] = useState(0); // 검색 결과 개수


  // 항공사
  const [ airline, setAirline ] = useState([]);





// 변경 함수


  // 필터링 Status (최저가 / 비행시간순) 변경 함수
  const changeFilter = (index) => {
    setActiveFilter(index);
  };

  // 경유 변경 함수
  const changeTransit = (index) => {
    const target = transitList[index];
    setActiveTransit((prev) => {
      if(prev.includes(target)) {
        const filtered = prev.filter((item) => item != target);
        return filtered;
      } else {
        return [...prev, transitList[index]];
      }
    });
  };

  // 출발 시간대 변경 함수
  const changeTime = (value) => {
    setDepartureTime(Number(value));
  }

  let hour = Math.floor(departureTime / 60);
  let minute = departureTime % 60;

  if(hour < 10) {
    hour = "0" + hour;
  }

  if(minute < 10) {
    minute = "0" + minute;
  }

  // 항공사 변경
  const changeAirline = (index) => {
    setAirlineStatus(airline[index]);
  };

  // 최저가 / 비행시간순 / 늦는순 정렬 타입
  const sortType = activeFilter === 0 ? "PRICE" :
                   activeFilter === 1 ? "DURATION" : "LATE"


  useEffect(() => {
    const renderCall = async () => {
      try {
        const url = 'http://localhost:8001/triptype/airline/list';
        const method = "get";

        const response = await axios({
          url,
          method,
          params : { ...searchParams, sortType }
        });

        const allFlights = response.data;

        console.log('all', allFlights);

        // 1. 서버에서 정렬되어 온 순서를 유지하기 위해 Map 객체 사용
        const pairedMap = new Map();

        allFlights.forEach((flight) => {
          const id = flight.flightOfferId;
          if (!pairedMap.has(id)) {
            // 처음 발견된 ID라면 맵에 삽입 (이 시점의 순서가 유지됨)
            pairedMap.set(id, { outbound: null, inbound: null });
          }

          const current = pairedMap.get(id);
          // 출발 공항 코드가 검색 조건의 출발지와 같으면 가는 편, 아니면 오는 편
          if (flight.departAirportCode === searchParams.depart) {
            current.outbound = flight;
          } else {
            current.inbound = flight;
          }
        });

        // 2. Map을 배열로 변환 (서버에서 정렬된 index 순서가 그대로 보존됨)
        let pairedArray = Array.from(pairedMap.values());

        // 3. 만약 프론트에서 추가 정렬이 필요하다면 (ISO 8601 시간 파싱 함수)
        const parseISOToMin = (iso) => {
          if (!iso) return 0;
          const hours = iso.match(/(\d+)H/) ? parseInt(iso.match(/(\d+)H/)[1]) : 0;
          const minutes = iso.match(/(\d+)M/) ? parseInt(iso.match(/(\d+)M/)[1]) : 0;
          return (hours * 60) + minutes;
        };

        if (sortType === "DURATION") {
          pairedArray.sort((a, b) => {
            const timeA = parseISOToMin(a.outbound?.flightDuration);
            const timeB = parseISOToMin(b.outbound?.flightDuration);
            return timeA - timeB; // 오름차순
          });
        }

        // 4. 상태 업데이트
        if (searchParams.tripType === "ROUND") {
          setRoundList(pairedArray);
          setResult(pairedArray.length);
        } else {
          setOutboundList(pairedArray);
          setResult(pairedArray.length);
        }

        console.log('pairedArray', pairedArray);

        if(sortType === "LATE") {
          pairedArray.sort((a, b) => {
            const dateA = new Date(a.outbound?.departDate);
            const dateB = new Date(b.outbound?.departDate);
            return dateB - dateA; // 내림차순
          })
        }

        // 항공사 목록 업데이트
        const airlines = Array.from(new Set(allFlights.map(f => f.airlineName).filter(Boolean)));
        setAirline(airlines);

      } catch (error) {
        console.error("데이터 로딩 오류:", error);
      }
    };

    renderCall();
  }, [activeFilter, searchParams, sortType]); // sortType 변경 시 서버 재요청

  console.log('outboundList', outboundList);
  console.log('roundList', roundList);

  return (
    <div className="airline-list-wrapper">
      {/* ================= 가격 요약 ================= */}
      <section className="price-table-wrapper">
        <WeekPriceList setActiveFilter={setActiveFilter} searchParams={searchParams}/>
      </section>

      {/* ================= 메인 레이아웃 ================= */}
      <div className="airline-list">
        {/* ===== 좌측 필터 ===== */}
        <aside className="side-1">
          <div className="filter-card">
            <div className="filter-section">
              <strong>경유</strong>
              {
                transitList.map((item, index) => 
                  <label key={index}>
                    <input type="checkbox" value={item} onChange={() => changeTransit(index)}/>{item}
                  </label>
                )
              }
            </div>

            <div className="filter-section">
              <strong>출발 시간대</strong>
              <p>오전 00:00 - 오후 {hour}:{minute}</p>
              <input type="range" min="0" max="1440" step="5" onChange={(e) => { changeTime(e.target.value) }}/>
            </div>

            <div className="filter-section">
              <strong>항공사</strong>
              <div className="airline-btns">
                {
                  airline.map((item, index) => 
                    <button key={index} 
                            value={item} 
                            onClick={() => changeAirline(index)}
                            className={airlineStatus == item ? "active" : ""}
                            >{item}</button>
                  )
                }
              </div>
            </div>
          </div>
        </aside>

        <AirlineModalComponent open={open} onClose={() => setOpen(false)}/>

        {/* ===== 메인 리스트 ===== */}
        <main>
          {/* 정렬 */}
          <div className="airline-ticket-sort">
            <div className="sort-tabs">
              <span className={ activeFilter == 0 ? "active" : "" } onClick={() => changeFilter(0)}>최저가</span>
              <span className={ activeFilter == 1 ? "active" : "" } onClick={() => changeFilter(1)}>비행시간순</span>
            </div>

            <select value={activeFilter} onChange={(e) => setActiveFilter(Number(e.target.value))}>
              {
                filterList.map((item, index) => 
                  <option key={index} value={index}>{ item }</option>
                )
              }
            </select>
          </div>

          <p className="result-count">
            {result}개의 검색 결과 ·
            <span className="price-check" onClick={() => {navigate("/airline/list/price")}}>가격변동 조회</span>
          </p>

          {
            searchParams.tripType == "ROUND" ?
            (
            roundList
            .map((pair, index) => (
              <TicketBoxComponent
                key={index}
                segment={pair.outbound} // 가는 편 데이터
                returnSegment={pair.inbound} // 오는 편 데이터
                tripType={pair.outbound.tripType === "N" ? "ROUND" : "ONEWAY"}
                setOpen={() => setOpen(true)}
                showPlus={pair.outbound.tripType !== "Y"}
              />
          ))
          ) : searchParams.tripType == "ONEWAY" ? 
          (
          outboundList
            .filter(pair => {
              if(!pair.outbound) return false;
              const type = pair.outbound.tripType === "N" ? "ROUND" : "ONEWAY";
              return type === searchParams.tripType; // 검색한 tripType과 일치하는 것만
            })
            .map((pair, index) => (
              <TicketBoxComponent
                key={index}
                segment={pair.outbound} // 가는 편 데이터
                returnSegment={pair.inbound} // 오는 편 데이터
                tripType={pair.outbound.tripType === "N" ? "ROUND" : "ONEWAY"}
                setOpen={() => setOpen(true)}
                showPlus={pair.outbound.tripType !== "Y"}
              />
          ))
          ) : null
          }

        </main>

        {/* ===== 우측 광고 ===== */}
        <aside className="side-2">
          <AlertChartListComponent/>
        </aside>
      </div>
    </div>
  );
};

export default AirlineListComponent;

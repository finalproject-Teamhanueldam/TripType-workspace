import "../css/AirlineListComponent.css";
import TicketBoxComponent from "../../common/TicketBoxComponent.jsx";
import AlertChartListComponent from "./AlertChartListComponent.jsx";
import AirlineModalComponent from "./AirlineModalComponent.jsx";
import WeekPriceList from "./WeekPriceListComponent.jsx";

import { useEffect, useState, useRef } from "react"; // ✅ [수정] useRef 추가 (polling 타이머/중복호출 방지)
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AirlineListComponent = () => {

  const navigate = useNavigate();

  /* =========================================================
     ✅ [수정 1] location.state가 새로고침/직접접근이면 null일 수 있음
     - 기존: const location = useLocation().state;
     - 문제: state가 null이면 아래 destructuring에서 바로 터짐
     - 해결: state 없으면 {}로 받아서 앱이 죽지 않게 방어
     ========================================================= */
  const locationState = useLocation().state || {};

  /* =========================================================
     ✅✅ [수정 2] (핵심) 비동기 검색 구조(searchId) 대응
     - 이전 구조: { searchParams, res }를 받음
     - 현재 백엔드 구조: POST /api/flights/search 는 "searchId"만 202로 반환
       → 목록 페이지는 GET /api/flights/search/{searchId} 로 polling 해야 리스트를 받음
     - 그래서 location.state에서 searchId도 같이 받도록 추가
     - 기존 코드 영향 최소: res가 있으면(구버전 흐름) 그대로 즉시 렌더 가능
     ========================================================= */
  const { searchParams, res, searchId } = locationState;

  console.log("searchParams:", searchParams);
  console.log("res(즉시 렌더 데이터):", res);
  console.log("searchId(비동기 결과 조회용):", searchId);

  // 필터
  const filterList = ["최저가", "비행시간순", "늦은출발"];

  // 경유 필터
  const transitList = ["직항", "1회 경유", "2회 이상"];

  // State
  // 필터링 Status (최저가 / 비행시간순)
  const [activeFilter, setActiveFilter] = useState(0);

  // 경유 필터
  const [activeTransit, setActiveTransit] = useState([]);

  // 출발 시간대
  const [departureTime, setDepartureTime] = useState(0);

  // 항공사
  const [airlineStatus, setAirlineStatus] = useState();

  // 모달창 (왕복, 경유일 경우)
  const [open, setOpen] = useState(false);

  // 백엔드에서 받아온 결과
  // 편도 전용
  const [outboundList, setOutboundList] = useState([]); // 가는 편
  const [inboundList, setInboundList] = useState([]);   // 오는 편

  // 왕복 전용
  const [roundList, setRoundList] = useState([]); // 왕복 (가는 편/오는 편)

  const [result, setResult] = useState(0); // 검색 결과 개수

  // 항공사
  const [airline, setAirline] = useState([]);

  /* =========================================================
     ✅✅ [수정 3] polling 관리용 ref
     - searchId polling은 "몇 초 동안 반복 호출"이 발생함
     - activeFilter/sortType 변경 등으로 useEffect가 재실행되면 polling이 중복될 수 있음
     - 이를 막기 위해 타이머/진행여부를 ref로 관리 (렌더링과 무관)
     ========================================================= */
  const pollTimerRef = useRef(null);
  const isPollingRef = useRef(false);

  // 변경 함수

  // 필터링 Status (최저가 / 비행시간순) 변경 함수
  const changeFilter = (index) => {
    setActiveFilter(index);
  };

  // 경유 변경 함수
  const changeTransit = (index) => {
    const target = transitList[index];
    setActiveTransit((prev) => {
      if (prev.includes(target)) {
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
  };

  let hour = Math.floor(departureTime / 60);
  let minute = departureTime % 60;

  if (hour < 10) {
    hour = "0" + hour;
  }

  if (minute < 10) {
    minute = "0" + minute;
  }

  // 항공사 변경
  const changeAirline = (index) => {
    setAirlineStatus(airline[index]);
  };

  // 최저가 / 비행시간순 / 늦는순 정렬 타입
  const sortType = activeFilter === 0 ? "PRICE" :
                   activeFilter === 1 ? "DURATION" : "LATE";

  /* =========================================================
     ✅ [수정 4] res(검색 직후 API 응답)를 "DB 조회 결과(allFlights)"와
        동일한 처리로직에 태울 수 있도록 함수로 분리
     - 기존: useEffect 내부에서만 allFlights -> pairedArray 처리
     - 변경: res든 DB 조회든 동일한 applyFlights()로 처리
     - 장점: 다른 코드 영향 최소 + 중복 제거 + 즉시 렌더 구현 가능
  ========================================================= */
  const applyFlights = (allFlights) => {

    console.log("✅ applyFlights 호출됨. count =", allFlights?.length);

    // 방어
    if (!Array.isArray(allFlights)) {
      console.log("⚠️ applyFlights: allFlights가 배열이 아님");
      allFlights = [];
    }

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
      if (flight.departAirportCode === searchParams?.depart) {
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

    if (sortType === "LATE") {
      pairedArray.sort((a, b) => {
        const dateA = new Date(a.outbound?.departDate);
        const dateB = new Date(b.outbound?.departDate);
        return dateB - dateA; // 내림차순
      });
    }

    // 4. 상태 업데이트
    if (searchParams?.tripType === "ROUND") {
      setRoundList(pairedArray);
      setResult(pairedArray.length);
    } else {
      setOutboundList(pairedArray);
      setResult(pairedArray.length);
    }

    console.log("pairedArray", pairedArray);

    // 항공사 목록 업데이트
    const airlines = Array.from(
      new Set(allFlights.map((f) => f.airlineName).filter(Boolean))
    );
    setAirline(airlines);
  };

  /* =========================================================
   ✅✅ [수정 5 - 교체본] searchId 기반 결과 polling
   - 202는 axios에서 catch로 안 떨어질 수 있음(2xx)
   - 그래서 response.status / response.data 형태로 PENDING을 판별해야 함
   - "배열(List)"이 올 때만 applyFlights 실행 후 종료
   ========================================================= */
  const pollSearchResult = async () => {
    if (!searchId) return;

    // 이미 polling 중이면 중복 시작 방지
    if (isPollingRef.current) return;
    isPollingRef.current = true;

    const url = `http://localhost:8001/triptype/api/flights/search/${searchId}`;

    const poll = async () => {
      try {
        const response = await axios.get(url);

        // ✅ 1) 202면 아직 준비 안됨 → 재시도
        // (axios는 202도 성공 처리라 catch로 안 감)
        if (response.status === 202) {
          console.log("⏳ searchId 결과 아직 준비 안됨(202). 재시도...");
          pollTimerRef.current = setTimeout(poll, 500);
          return;
        }

        // ✅ 2) status는 200인데 body가 {status:"PENDING"} 같은 객체면 이것도 재시도
        // (지금 네 콘솔에서 발생한 케이스 방어)
        if (!Array.isArray(response.data)) {
          console.log("⏳ body가 배열이 아님(PENDING 가능). 재시도...", response.data);
          pollTimerRef.current = setTimeout(poll, 500);
          return;
        }

        // ✅ 3) 여기 도달하면 진짜 List<AirlineListVo>
        const list = response.data;
        console.log("✅ searchId 결과 수신(배열):", list.length);

        applyFlights(list);

        // polling 종료
        isPollingRef.current = false;
        if (pollTimerRef.current) {
          clearTimeout(pollTimerRef.current);
          pollTimerRef.current = null;
        }

      } catch (error) {
        console.error("❌ polling 오류:", error);
        toast.error("항공편 조회 중 오류가 발생했습니다.");

        // polling 종료
        isPollingRef.current = false;
        if (pollTimerRef.current) {
          clearTimeout(pollTimerRef.current);
          pollTimerRef.current = null;
        }
      }
    };

    poll();
  };


  useEffect(() => {

    /* =========================================================
       ✅ [수정 6] searchParams가 없으면 페이지 접근 자체가 성립 불가
       - 새로고침하면 state가 날아가서 searchParams가 undefined가 될 수 있음
       - 기존 코드는 searchParams를 바로 사용해서 런타임 오류 발생 가능
       - 해결: searchParams 없으면 메인으로 보냄(앱 안죽게)
    ========================================================= */
    if (!searchParams) {
      toast.info("검색 조건이 없습니다. 메인으로 이동합니다.");
      navigate("/");
      return;
    }

    const renderCall = async () => {
      try {

        /* =========================================================
           ✅ [수정 7] "구버전 즉시 렌더(res)"는 그대로 유지
           - 만약 search 페이지가 아직도 res를 넘기는 구조라면
             지금 코드 그대로 즉시 렌더 가능
        ========================================================= */
        if (Array.isArray(res) && res.length > 0) {
          console.log("✅ res로 즉시 렌더 수행:", res.length);
          applyFlights(res);
          return;
        }

        /* =========================================================
           ✅✅ [수정 8] (핵심) res가 없고 searchId가 있으면 polling으로 채움
           - 지금 네 백엔드 구조에서 정답 루트
           - DB적재는 백그라운드에서 하고 있으니,
             결과 준비될 때까지 GET /api/flights/search/{searchId}를 폴링한다.
        ========================================================= */
        if (searchId) {
          console.log("✅ res 없음 + searchId 있음 → polling 시작");
          pollSearchResult();
          return;
        }

        /* =========================================================
           ✅ [수정 9] (기존 fallback 유지) res도 없고 searchId도 없으면
              기존 DB 조회 API(/airline/list) 호출
           - 새로고침/직접접근인데 searchId를 안 넘긴 케이스 대응
           - 다른 코드 영향 최소: 기존 방식 그대로 둠
        ========================================================= */
        const url = "http://localhost:8001/triptype/airline/list";
        const method = "get";

        const response = await axios({
          url,
          method,
          params: { ...searchParams, sortType },
        });

        const allFlights = response.data;

        console.log("✅ DB 조회 결과:", allFlights);

        applyFlights(allFlights);

      } catch (error) {
        console.error("데이터 로딩 오류:", error);
      }
    };

    renderCall();

    /* =========================================================
       ✅✅ [수정 10] cleanup: 페이지 이동/언마운트 시 polling 타이머 정리
       - 안 하면 다른 페이지 갔다 와도 setState가 튀는 현상이 생길 수 있음
    ========================================================= */
    return () => {
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
        pollTimerRef.current = null;
      }
      isPollingRef.current = false;
    };

    /* =========================================================
       ✅ [수정 11] useEffect 의존성
       - 기존: [activeFilter, searchParams, sortType, res, navigate]
       - 변경: searchId 추가 (비동기 결과 조회 트리거)
       - activeFilter는 sortType에 포함되지만 기존 영향 최소 위해 유지
    ========================================================= */
  }, [activeFilter, searchParams, sortType, res, searchId, navigate]);

  console.log("outboundList", outboundList);
  console.log("roundList", roundList);

  // detail 페이지 이동
  const goDetail = (pair) => {
    console.log("onClick", pair);
    const flightOfferId =
      pair.outbound?.flightOfferId || pair.inbound?.flightOfferId;

    if (!flightOfferId) {
      toast.info("존재하지 않는 항공권입니다.");
      return;
    }

    navigate(`/airline/detail/${flightOfferId}`, {
      state: {
        outbound: pair.outbound,
        inbound: pair.inbound,
        tripType: pair.outbound?.tripType === "N" ? "ROUND" : "ONEWAY",
      },
    });
  };

  return (
    <div className="airline-list-wrapper">
      {/* ================= 가격 요약 ================= */}
      <section className="price-table-wrapper">
        <WeekPriceList setActiveFilter={setActiveFilter} searchParams={searchParams} />
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
                    <input type="checkbox" value={item} onChange={() => changeTransit(index)} />{item}
                  </label>
                )
              }
            </div>

            <div className="filter-section">
              <strong>출발 시간대</strong>
              <p>오전 00:00 - 오후 {hour}:{minute}</p>
              <input
                type="range"
                min="0"
                max="1440"
                step="5"
                onChange={(e) => { changeTime(e.target.value); }}
              />
            </div>

            <div className="filter-section">
              <strong>항공사</strong>
              <div className="airline-btns">
                {
                  airline.map((item, index) =>
                    <button
                      key={index}
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

        <AirlineModalComponent open={open} onClose={() => setOpen(false)} />

        {/* ===== 메인 리스트 ===== */}
        <main>
          {/* 정렬 */}
          <div className="airline-ticket-sort">
            <div className="sort-tabs">
              <span className={activeFilter == 0 ? "active" : ""} onClick={() => changeFilter(0)}>최저가</span>
              <span className={activeFilter == 1 ? "active" : ""} onClick={() => changeFilter(1)}>비행시간순</span>
            </div>

            <select value={activeFilter} onChange={(e) => setActiveFilter(Number(e.target.value))}>
              {
                filterList.map((item, index) =>
                  <option key={index} value={index}>{item}</option>
                )
              }
            </select>
          </div>

          <p className="result-count">
            {result}개의 검색 결과 ·
            <span className="price-check" onClick={() => { navigate("/airline/list/price"); }}>가격변동 조회</span>
          </p>

          {
            searchParams?.tripType == "ROUND" ?
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
                      onClick={() => goDetail(pair)}
                    />
                  ))
              ) : searchParams?.tripType == "ONEWAY" ?
                (
                  outboundList
                    .filter(pair => {
                      if (!pair.outbound) return false;
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
                        onClick={() => goDetail(pair)}
                      />
                    ))
                ) : null
          }

        </main>

        {/* ===== 우측 광고 ===== */}
        <aside className="side-2">
          <AlertChartListComponent />
        </aside>
      </div>
    </div>
  );
};

/*
[추가/수정 요약]

- [수정 2] location.state에서 searchId도 받도록 추가
  const { searchParams, res, searchId } = locationState;

- [수정 3] polling 제어용 useRef 2개 추가
  pollTimerRef / isPollingRef

- [수정 5] pollSearchResult() 추가
  GET /api/flights/search/{searchId} 를 202면 재시도, 200이면 applyFlights로 렌더

- [수정 8] res가 없고 searchId가 있으면 polling 타도록 renderCall 흐름 추가

- [수정 10] cleanup에서 polling 타이머 정리

- [수정 11] useEffect deps에 searchId 추가

※ 기존 res 즉시 렌더 / 기존 DB조회(/airline/list) fallback 로직은 그대로 유지해서
  다른 코드 영향 최소화
*/
export default AirlineListComponent;

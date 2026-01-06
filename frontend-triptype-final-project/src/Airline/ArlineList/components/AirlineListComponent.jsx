import "../css/AirlineListComponent.css";
import TicketBoxComponent from "../../common/TicketBoxComponent.jsx";
import AlertChartListComponent from "./AlertChartListComponent.jsx";
import AirlineModalComponent from "./AirlineModalComponent.jsx";
import WeekPriceList from "./WeekPriceListComponent.jsx";

import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AirlineListComponent = () => {

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();
  const locationState = useLocation().state || {};
  const { searchParams, res, searchId } = locationState;


  // State
  const [selectedPair, setSelectedPair] = useState(null);
  const [open, setOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(0);
  const [activeTransit, setActiveTransit] = useState([]);
  const [departureTime, setDepartureTime] = useState(1440);
  const [airlineStatus, setAirlineStatus] = useState(null);
  const [outboundList, setOutboundList] = useState([]); // ONEWAY + MULTI (outbound=첫 구간)
  const [roundList, setRoundList] = useState([]);
  const [result, setResult] = useState(0);
  const [airline, setAirline] = useState([]);

  const airlineUrl = [
      {'대한항공' : 'https://www.koreanair.com'},
      {'아시아나항공' : 'https://www.flyasiana.com'},
      {'제주항공' : 'https://www.jejuair.net'},
      {'진에어' : 'https://www.jinair.com'},
      {'티웨이항공' : 'https://www.twayair.com'},
      {'에어부산' : 'https://www.airbusan.com'},
      {'에어서울' : 'https://www.flyairseoul.com'},
      {'전일본공수' : 'https://www.ana.co.jp'},
      {'일본항공' : 'https://www.jal.co.jp'},
      {'캐세이퍼시픽' : 'https://www.cathaypacific.com'},
      {'싱가포르항공' : 'https://www.singaporeair.com'},
      {'타이항공' : 'https://www.thaiairways.com'},
      {'베트남항공' : 'https://www.vietnamairlines.com'},
      {'유나이티드항공' : 'https://www.united.com'},
      {'델타항공' : 'https://www.delta.com'},
      {'아메리칸항공' : 'https://www.aa.com'},
      {'루프트한자' : 'https://www.lufthansa.com'},
      {'에어프랑스' : 'https://www.airfrance.com'},
      {'KLM 네덜란드항공' : 'https://www.klm.com'},
      {'에미레이트항공' : 'https://www.emirates.com'}
  ];

  // ✅ 추천/인기노선처럼 searchId 없이 들어온 경우 대비
  const [runtimeSearchId, setRuntimeSearchId] = useState(searchId || null);

  // Ref (Polling 관리)
  const pollTimerRef = useRef(null);
  const isPollingRef = useRef(false);

  // 상수 데이터
  const filterList = ["최저가", "비행시간순", "늦은출발"];
  const transitList = ["모두", "직항", "1회 경유", "2회 이상"];
  const sortType =
    activeFilter === 0 ? "PRICE" : activeFilter === 1 ? "DURATION" : "LATE";

  // 모달 열기 함수
  const handleOpenModal = (item) => {
    const normalized = {
      outbound: item?.outbound || item?.segments?.[0] || null,
      inbound: item?.inbound || null,
      segments: item?.segments || null,
      // ✅ 0도 유효하므로 || 체인은 위험 -> nullish 병합으로 처리
      flightOfferId:
        item?.flightOfferId ??
        item?.outbound?.flightOfferId ??
        item?.inbound?.flightOfferId ??
        null,
      tripType: searchParams?.tripType,
    };
    setSelectedPair(normalized);
    setOpen(true);
  };

  // ✅ MULTI도 경유 필터가 말이 되게 item.segments 길이를 우선 사용
  const matchTransit = (itemOrSegment) => {
    // 아무 것도 선택 안 했으면 전체 허용
    if (activeTransit.length === 0) return true;

    const selected = activeTransit[0];

    // MULTI(또는 segments가 있는 경우): stops = segments.length - 1
    const segs = itemOrSegment?.segments;
    if (Array.isArray(segs) && segs.length > 0) {
      const stops = Math.max(segs.length - 1, 0);
      if (selected === "직항") return stops === 0;
      if (selected === "1회 경유") return stops === 1;
      if (selected === "2회 이상") return stops >= 2;
      return true;
    }

    // 기존: segment.flightSegmentNo를 경유 횟수로 쓰는 케이스
    const segment = itemOrSegment;
    if (!segment || segment.flightSegmentNo === undefined) return false;

    const count = segment.flightSegmentNo;
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
      - ROUND: {outbound, inbound}
      - ONEWAY: {outbound, segments?} (경유면 segments > 1 가능)
      - MULTI: {outbound(첫구간), segments[]}
  ========================================================= */
  const applyFlights = useCallback(
    (allFlights) => {
      console.log("✅ applyFlights 데이터 수신:", allFlights?.length, "건");

      if (!Array.isArray(allFlights) || allFlights.length === 0) {
        setAirline([]);
        setResult(0);
        setRoundList([]);
        setOutboundList([]);
        return;
      }

      // 1) 항공사 목록
      const airlines = Array.from(
        new Set(allFlights.map((f) => f.airlineName).filter(Boolean))
      );
      setAirline(airlines);

      // 2) offerId로 그룹 (✅ 0은 유효, null/undefined만 제외)
      const offerMap = new Map();
      allFlights.forEach((f) => {
        const id = f.flightOfferId;

        // ✅ 핵심 수정: 0은 버리면 안 됨
        if (id === null || id === undefined) return;

        if (!offerMap.has(id)) offerMap.set(id, []);
        offerMap.get(id).push(f);
      });

      const sortByDepartAsc = (arr) =>
        arr
          .slice()
          .sort((a, b) => new Date(a.departDate) - new Date(b.departDate));

      const parseISOToMin = (iso) => {
        if (!iso) return 0;
        const h = iso.match(/(\d+)H/) ? parseInt(iso.match(/(\d+)H/)[1]) : 0;
        const m = iso.match(/(\d+)M/) ? parseInt(iso.match(/(\d+)M/)[1]) : 0;
        return h * 60 + m;
      };

      // 3) tripType별 가공
      if (searchParams?.tripType === "ROUND") {
        const pairedArray = [];

        offerMap.forEach((flights, offerId) => {
          const sorted = sortByDepartAsc(flights);

          let outbound = null;
          let inbound = null;

          sorted.forEach((flight) => {
            if (flight.departAirportCode === searchParams?.depart) outbound = flight;
            else inbound = flight;
          });

          pairedArray.push({ outbound, inbound, flightOfferId: offerId });
        });

        // 정렬
        if (sortType === "DURATION") {
          pairedArray.sort(
            (a, b) =>
              parseISOToMin(a.outbound?.flightDuration) -
              parseISOToMin(b.outbound?.flightDuration)
          );
        } else if (sortType === "LATE") {
          pairedArray.sort(
            (a, b) =>
              new Date(b.outbound?.departDate) - new Date(a.outbound?.departDate)
          );
        }

        setRoundList(pairedArray);
        setOutboundList([]);
        setResult(pairedArray.length);
        return;
      }

      // ✅ MULTI / ONEWAY: outbound=첫 구간, segments=전체 구간(오름차순)
      const list = [];
      offerMap.forEach((flights, offerId) => {
        const segments = sortByDepartAsc(flights);
        const outbound = segments[0] || null;

        list.push({
          outbound,
          inbound: null,
          segments,
          flightOfferId: offerId,
        });
      });

      if (sortType === "DURATION") {
        list.sort(
          (a, b) =>
            parseISOToMin(a.outbound?.flightDuration) -
            parseISOToMin(b.outbound?.flightDuration)
        );
      } else if (sortType === "LATE") {
        list.sort(
          (a, b) =>
            new Date(b.outbound?.departDate) - new Date(a.outbound?.departDate)
        );
      }

      setOutboundList(list);
      setRoundList([]);
      setResult(list.length);
    },
    [searchParams?.depart, searchParams?.tripType, sortType]
  );

  /* =========================================================
      ✅ Polling 함수
  ========================================================= */
  const pollSearchResult = useCallback(
    async (id) => {
      const sid = id || runtimeSearchId;
      if (!sid || isPollingRef.current) return;

      isPollingRef.current = true;

      const url = `${API_BASE_URL}/api/flights/search/${sid}`;
      console.log("[POLL START] sid =", sid, "url =", url);

      // ✅ 무한 폴링 방지: 최대 60회(=60초) 시도
      let attempt = 0;
      const MAX_ATTEMPT = 60;

      const poll = async () => {
        attempt += 1;

        try {
          const response = await axios.get(url);

          // ✅ 핵심 로그 (이 3개는 반드시)
          console.log("[POLL]", "attempt =", attempt, "status =", response.status);
          console.log("[POLL]", "isArray =", Array.isArray(response.data));
          console.log("[POLL]", "data =", response.data);

          // ✅ 1) 최대 횟수 초과 시 종료
          if (attempt >= MAX_ATTEMPT) {
            console.error("❌ POLL TIMEOUT: 최대 시도 초과", { sid, url });
            toast.error("검색 결과를 불러오지 못했습니다. (시간 초과)");
            isPollingRef.current = false;
            if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
            return;
          }

          // ✅ 2) 202면 pending
          if (response.status === 202) {
            pollTimerRef.current = setTimeout(poll, 1000);
            return;
          }

          // ✅ 3) 200인데 배열이 아니면: 서버가 에러/상태 객체를 준 것
          if (!Array.isArray(response.data)) {
            const msg =
              response?.data?.message ||
              response?.data?.error ||
              "서버 응답 형식이 예상과 다릅니다.";
            console.error("❌ POLL INVALID RESPONSE (not array):", response.data);
            toast.error(msg);

            isPollingRef.current = false;
            if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
            return;
          }

          // ✅ 4) 정상 데이터 수신(배열)
          console.log("✅ polling 결과 수신:", response.data.length);
          applyFlights(response.data);

          isPollingRef.current = false;
          if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
        } catch (error) {
          console.error("❌ Polling 실패:", error);
          console.error("❌ status:", error?.response?.status);
          console.error("❌ response.data:", error?.response?.data);

          toast.error("검색 결과 조회 중 오류가 발생했습니다.");
          isPollingRef.current = false;
          if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
        }
      };

      poll();
    },
    [applyFlights, runtimeSearchId]
  );

  /* =========================================================
      ✅ searchId 동기화
  ========================================================= */
  useEffect(() => {
    if (searchId) setRuntimeSearchId(searchId);
  }, [searchId]);

  /* =========================================================
      ✅ (추천/인기노선) searchParams만 있을 때: 여기서 search 생성 후 polling
  ========================================================= */
  const createSearchAndPoll = useCallback(async () => {
    if (!searchParams) return null;

    console.log("[POST /api/flights/search] request searchParams =", searchParams);

    try {
      const token = localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await axios.post(
        `${API_BASE_URL}/api/flights/search`,
        searchParams,
        { headers }
      );

      console.log("[POST /api/flights/search] response data =", data);
      console.log("[POST /api/flights/search] searchId =", data?.searchId);

      const sid = data?.searchId;
      if (!sid) throw new Error("searchId가 없습니다.");

      setRuntimeSearchId(sid);
      pollSearchResult(sid);
      return sid;
    } catch (e) {
      console.error("❌ 검색 생성 실패:", e);
      console.error("❌ status:", e?.response?.status);
      console.error("❌ response.data:", e?.response?.data);
      toast.error("검색 생성에 실패했습니다.");
      return null;
    }
  }, [pollSearchResult, searchParams]);

  /* =========================================================
      ✅ 최초 렌더/필터 변경 시 로딩 흐름
  ========================================================= */
  useEffect(() => {
    if (!searchParams) {
      toast.info("검색 조건이 없습니다. 메인으로 이동합니다.");
      navigate("/");
      return;
    }

    const run = async () => {
      // 1) 즉시 렌더 데이터
      if (Array.isArray(res) && res.length > 0) {
        applyFlights(res);
        return;
      }

      // 2) searchId로 polling
      if (runtimeSearchId) {
        pollSearchResult(runtimeSearchId);
        return;
      }

      // 3) 추천/인기노선: searchParams만 온 경우 → 여기서 search 생성
      const created = await createSearchAndPoll();
      if (created) return;

      // 4) fallback
      try {
        const response = await axios.get(
          `${API_BASE_URL}/airline/list`,
          { params: { ...searchParams, sortType } }
        );
        applyFlights(response.data);
      } catch (error) {
        console.error("데이터 로딩 오류:", error);
      }
    };

    run();

    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      isPollingRef.current = false;
    };
  }, [
    activeFilter,
    searchParams,
    sortType,
    res,
    runtimeSearchId,
    navigate,
    applyFlights,
    pollSearchResult,
    createSearchAndPoll,
  ]);

  // 핸들러 함수들
  const changeFilter = (index) => setActiveFilter(index);

  const changeTransit = (index) => {
    const target = transitList[index];

    if (target === "모두") {
      setActiveTransit([]); // ✅ 전체 허용
    } else {
      setActiveTransit([target]);
    }
  };


  const changeTime = (value) => setDepartureTime(Number(value));
  const changeAirline = (name) => {
    setAirlineStatus((prev) => (prev === name ? null : name));
  };

  const hour = String(Math.floor(departureTime / 60)).padStart(2, "0");
  const minute = String(departureTime % 60).padStart(2, "0");

  const goDetail = (item) => {
    // ✅ 0도 유효하므로 || 체인은 위험 -> nullish 병합으로 처리
    const flightOfferId =
      item?.flightOfferId ??
      item?.outbound?.flightOfferId ??
      item?.inbound?.flightOfferId;

    // ✅ 핵심 수정: null/undefined만 차단
    if (flightOfferId === null || flightOfferId === undefined) {
      return toast.info("존재하지 않는 항공권입니다.");
    }

    navigate(`/airline/detail/${flightOfferId}`, {
      state: {
        tripType: searchParams?.tripType,
        outbound: item?.outbound || null,
        inbound: searchParams?.tripType === "ROUND" ? item?.inbound || null : null,
        segments: item?.segments || null, // ✅ MULTI/경유(편도) 대비
      },
    });
  };

  const getFilteredList = () => {
    const baseList = searchParams?.tripType === "ROUND" ? roundList : outboundList;

    return baseList.filter((item) => {
      const outbound = item?.outbound;
      if (!outbound) return false;

      // 항공사 필터
      if (airlineStatus && outbound.airlineName !== airlineStatus) return false;

      // ✅ 경유 필터: MULTI면 item.segments 기준, 아니면 outbound 기준
      if (searchParams?.tripType === "MULTI") {
        if (!matchTransit(item)) return false;
      } else {
        if (!matchTransit(outbound)) return false;
      }

      // 출발 시간대 필터
      const departMinutes = getDepartMinutes(outbound.departDate);
      if (departMinutes > departureTime) return false;

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
                <input
                  type="radio"
                  name="segment-option"
                  value={item}
                  checked={
                    item === "모두"
                      ? activeTransit.length === 0
                      : activeTransit[0] === item
                  }
                  onChange={() => changeTransit(index)}
                />
                {item}
              </label>
            ))}
            </div>

            <div className="filter-section">
              <strong>출발 시간대</strong>
              <p>
                오전 00:00 - 오후 {hour}:{minute}
              </p>
              <input
                type="range"
                min="0"
                max="1440"
                step="5"
                onChange={(e) => changeTime(e.target.value)}
              />
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
                  <p style={{ fontSize: "12px", color: "#999" }}>
                    항공사 정보를 불러오는 중...
                  </p>
                )}
              </div>
            </div>
          </div>
        </aside>

        <AirlineModalComponent
          open={open}
          onClose={() => {
            setOpen(false);
            setSelectedPair(null);
          }}
          pair={selectedPair}
        />

        <main>
          <div className="airline-ticket-sort">
            <div className="sort-tabs">
              <span
                className={activeFilter === 0 ? "active" : ""}
                onClick={() => changeFilter(0)}
              >
                최저가
              </span>
              <span
                className={activeFilter === 1 ? "active" : ""}
                onClick={() => changeFilter(1)}
              >
                비행시간순
              </span>
            </div>

            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(Number(e.target.value))}
            >
              {filterList.map((item, index) => (
                <option key={index} value={index}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <p className="result-count">
            {filteredData.length}개의 검색 결과 ·
            {
              searchParams.tripType == "MULTI" ? "" : 
              <span
                className="price-check"
                onClick={() => navigate("/airline/list/price", { state: { searchParams } })}
              >
              {" "}
              가격변동 조회
              </span>
            }
          </p>

          {filteredData.map((item, index) => (
            <TicketBoxComponent
              key={index}
              segment={item.outbound}
              returnSegment={searchParams?.tripType === "ROUND" ? item.inbound : null}
              tripType={searchParams?.tripType}
              setOpen={() => handleOpenModal(item)}
              showPlus={searchParams?.tripType === "ROUND"}
              onClick={() => goDetail(item)}
              segments={item.segments} // MULTI/경유
              airlineUrl={airlineUrl[item.outbound.airlineName]} // ✅ 여기서 URL 매핑
            />
          ))}

        </main>

        <aside className="side-2">
          <AlertChartListComponent />
        </aside>
      </div>
    </div>
  );
};

export default AirlineListComponent;

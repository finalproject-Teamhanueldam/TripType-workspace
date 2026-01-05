import "../css/TotalCss.css";
import "../css/AirlineDetailComponent.css";
import left from "../images/left.svg";
import TicketPriceChart from "./AlertChartDetailComponent";
import TicketBoxComponent from "../../common/TicketBoxComponent";
import ReviewComponent from "./ReviewComponent";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AirlineDetailComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { offerId } = useParams();

  // state에서 받은 값
  const state = location.state || {};
  const stateInbound = state?.inbound || null;
  const stateOutbound = state?.outbound || null;
  const stateTripType = state?.tripType || null;
  const stateSegments = state?.segments || null;

  // ✅ fallback으로 서버에서 받아온 상세 데이터
  const [loaded, setLoaded] = useState(false);
  const [fallbackOutbound, setFallbackOutbound] = useState(null);
  const [fallbackInbound, setFallbackInbound] = useState(null);
  const [fallbackSegments, setFallbackSegments] = useState(null);
  const [fallbackTripType, setFallbackTripType] = useState(null);

  // ✅ 찜 state는 반드시 return 전에 선언되어야 함 (Hooks 순서 고정)
  const [isWished, setIsWished] = useState(false);

  // ✅ 최종 데이터 소스 결정 (state 우선)
  const outbound = stateOutbound || fallbackOutbound;
  const inbound = stateInbound || fallbackInbound;

  const segments = useMemo(() => {
    const s =
      Array.isArray(stateSegments) && stateSegments.length > 0
        ? stateSegments
        : Array.isArray(fallbackSegments) && fallbackSegments.length > 0
        ? fallbackSegments
        : null;
    return s;
  }, [stateSegments, fallbackSegments]);

  const tripType = stateTripType || fallbackTripType;

  // ✅ 헤더/표시용 구간 (첫/마지막)
  const firstSeg = segments ? segments[0] : outbound;
  const lastSeg = segments ? segments[segments.length - 1] : outbound;

  // ✅ tripType 보정
  const resolvedTripType = useMemo(() => {
    if (tripType) return tripType;
    if (inbound) return "ROUND";
    if (segments && segments.length > 1) return "MULTI";
    return "ONEWAY";
  }, [tripType, inbound, segments]);

  // ✅ wishOfferId도 memo로 고정 (0도 유효하니 nullish로 처리)
  const wishOfferId = useMemo(() => {
    return (
      firstSeg?.flightOfferId ??
      outbound?.flightOfferId ??
      inbound?.flightOfferId ??
      offerId ??
      null
    );
  }, [firstSeg, outbound, inbound, offerId]);

  // ================================
  // ✅ (중요) 새로고침/직접접근 fallback
  // ================================
  useEffect(() => {
    const needFallback =
      !stateOutbound && !(Array.isArray(stateSegments) && stateSegments.length > 0);

    if (!needFallback) {
      setLoaded(true);
      return;
    }

    if (!offerId) {
      setLoaded(true);
      return;
    }

    const fetchDetail = async () => {
      try {
        const DETAIL_URL = `http://localhost:8001/triptype/api/flights/offer/${offerId}`;

        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const { data } = await axios.get(DETAIL_URL, { headers });

        let segs = null;

        if (Array.isArray(data) && data.length > 0) {
          segs = data;
        } else if (Array.isArray(data?.segments) && data.segments.length > 0) {
          segs = data.segments;
        } else if (Array.isArray(data?.flights) && data.flights.length > 0) {
          segs = data.flights;
        }

        if (segs) {
          segs = segs
            .slice()
            .sort((a, b) => new Date(a.departDate) - new Date(b.departDate));
        }

        let out = null;
        let inb = null;

        const serverTripType = data?.tripType || null;

        if (serverTripType === "ROUND" && segs && segs.length > 0) {
          if (data?.outbound) out = data.outbound;
          if (data?.inbound) inb = data.inbound;

          if (!out) out = segs[0];
          if (!inb && segs.length >= 2) inb = segs[segs.length - 1];
        } else {
          out = segs?.[0] || data?.outbound || null;
          inb = data?.inbound || null;
        }

        setFallbackSegments(segs);
        setFallbackOutbound(out);
        setFallbackInbound(inb);
        setFallbackTripType(serverTripType);
      } catch (e) {
        console.error("❌ 상세 fallback 조회 실패:", e);
        console.error("❌ status:", e?.response?.status);
        console.error("❌ response.data:", e?.response?.data);
        toast.error("상세 정보를 불러오지 못했습니다.");
      } finally {
        setLoaded(true);
      }
    };

    fetchDetail();
  }, [offerId, stateOutbound, stateSegments]);

  // ================================
  // ✅ 찜 상태 조회 (Hooks 순서 고정: return 위)
  // ================================
  useEffect(() => {
    const fetchWishStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        if (wishOfferId === null || wishOfferId === undefined) return;

        const response = await axios.get(
          "http://localhost:8001/triptype/airline/wish/check",
          {
            params: { flightOfferId: wishOfferId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setIsWished(response.data);
      } catch (error) {
        console.error("찜 상태 조회 실패", error);
      }
    };

    fetchWishStatus();
  }, [wishOfferId]);

  // ✅ 로딩 상태 (fallback 조회 중)
  if (!loaded) {
    return <div>로딩 중...</div>;
  }

  // ✅ 최종 데이터 없으면 종료
  if (!firstSeg) {
    return <div>데이터를 찾을 수 없습니다.</div>;
  }

  const toggleWish = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (token == null) {
        toast.info("로그인을 먼저 진행해주세요.");
        return;
      }
      if (wishOfferId === null || wishOfferId === undefined) {
        toast.info("항공권 정보를 확인할 수 없습니다.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8001/triptype/airline/wish/toggle",
        { flightOfferId: wishOfferId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsWished(response.data);
    } catch (error) {
      console.error("찜 처리 실패", error);
    }
  };

  // ================================
  // ✅ 헤더 표시
  // ================================
  const headerRoute = `${firstSeg.departCity}(${firstSeg.departAirportCode}) → ${lastSeg.arriveCity}(${lastSeg.arriveAirportCode})`;
  const headerDate = (firstSeg.departDate || "").split("T")[0];

  const headerTripLabel =
    resolvedTripType === "ROUND"
      ? " 왕복"
      : resolvedTripType === "MULTI"
      ? ` 다구간(${segments ? segments.length : 1}구간)`
      : " 편도";

  return (
    <div className="airline-detail-container">
      {/* 상단 헤더 */}
      <div className="ticket-header">
        <img
          className="ticekt-header-left"
          src={left}
          alt="뒤로가기"
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />

        <div className="ticekt-header-info">
          <div className="ticekt-header-route">{headerRoute}</div>
          <div className="ticekt-header-date">
            {headerDate} · {headerTripLabel}
          </div>
        </div>

        <button
          className={`ticekt-header-wish-btn ${isWished ? "active" : ""}`}
          onClick={toggleWish}
        >
          {isWished ? "❤️" : "♡"}
        </button>
      </div>

      <div className="airline-detail-layout">
        <div className="left-section">
          {/* ✅ MULTI는 구간별로 TicketBox를 반복 렌더 */}
          {resolvedTripType === "MULTI" && Array.isArray(segments) && segments.length > 0 ? (
            <>
              <p className="section-title">여정</p>

              {segments.map((seg, idx) => (
                <TicketBoxComponent
                  key={idx}
                  segment={seg}
                  returnSegment={null}
                  showPlus={false}
                  tripType="ONEWAY"  // ✅ 각 구간은 편도 카드로 표시
                  segments={null}    // ✅ 카드 내부에서 segments로 묶지 않게
                />
              ))}
            </>
          ) : (
            <>
              <p className="section-title">가는 편</p>

              <TicketBoxComponent
                segment={firstSeg}
                returnSegment={null}
                showPlus={false}
                tripType={resolvedTripType}
                segments={segments}
              />
            </>
          )}

          {resolvedTripType === "ROUND" && inbound && (
            <>
              <p className="section-title">오는 편</p>
              <TicketBoxComponent
                segment={inbound}
                showPlus={false}
                tripType={resolvedTripType}
              />
            </>
          )}

          <div className="review-wrapper">
            <ReviewComponent
              outbound={outbound || firstSeg}
              inbound={inbound}
              segments={segments}
              tripType={resolvedTripType}
            />
          </div>
        </div>

        <aside className="right-section">
          <div className="sticky-box">
            <TicketPriceChart flightOfferId={wishOfferId} tripType={resolvedTripType} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AirlineDetailComponent;

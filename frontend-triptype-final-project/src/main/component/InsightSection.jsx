import "../css/InsightSection.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../common/api/axiosInstance.js"; // ✅ 너희 경로 기준

const InsightSection = () => {
  const navigate = useNavigate();

  // ✅ 인기 목적지(도착지) Top N
  const [trendDestinations, setTrendDestinations] = useState([]); // [{ arrive:"NRT", count: 12 }, ...]

  // ✅ IATA -> 한글명(없으면 코드 그대로)
  // 프로젝트에 DESTINATIONS 상수 있으면 그걸 import해서 매핑 쓰는 게 더 좋음.
  const IATA_NAME = useMemo(
    () => ({
      NRT: "도쿄",
      KIX: "오사카",
      DAD: "다낭",
      FUK: "후쿠오카",
      BKK: "방콕",
      DPS: "발리",
    }),
    []
  );

  const insights = useMemo(
    () => [
      {
        id: 1,
        icon: "📉",
        badge: "INSIGHT",
        title: "가격 변동 인사이트",
        desc: "최근 7일간 항공권 가격 흐름을 분석해\n지금이 좋은 타이밍인지 알려드려요.",
        sub: "서울 → 오사카 평균가 ▼11%",
        cta: "가격 흐름 보기",
      },
      {
        id: 2,
        icon: "🔔",
        badge: "ALERT",
        title: "가격 알림 기능",
        desc: "원하는 가격에 도달하면\n알림으로 바로 알려드려요.",
        sub: "실시간 가격 추적",
        cta: "가격 알림 설정",
      },
      {
        id: 3,
        icon: "🔥",
        badge: "TREND",
        title: "인기 검색 노선",
        desc: "지금 가장 많이 검색되고 있는\n항공권 노선을 확인해보세요.",
        sub: "서울 → (불러오는 중...)",
        cta: "바로 검색",
      },
    ],
    []
  );

  // ✅ 인기 목적지 문구 만들기
  const trendSubText = useMemo(() => {
    if (!trendDestinations || trendDestinations.length === 0) return "서울 → (불러오는 중...)";
    const names = trendDestinations
      .slice(0, 3)
      .map((x) => IATA_NAME[x.arrive] || x.arrive);
    return `서울 → ${names.join(" · ")}`;
  }, [trendDestinations, IATA_NAME]);

  // ✅ 최근 7일 인기 목적지 조회
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // ✅ TODO: 너희 백엔드 인기목적지 API로 변경
        // 예) GET /api/trends/destinations?days=7&limit=3
        const r = await api.get("/api/trends/destinations", {
          params: { days: 7, limit: 3 },
        });

        // 응답 형태: { success:true, data:[{arrive, count}...] } 가정
        const data = r?.data?.data;
        if (!cancelled && Array.isArray(data)) {
          setTrendDestinations(data);
        }
      } catch (e) {
        // 실패해도 UI는 유지 (하드코딩/빈 상태)
        if (!cancelled) setTrendDestinations([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // ✅ 바로검색: 고정 필터로 검색 API 호출 → 목록조회 이동
  const handleQuickSearchTrend = async () => {
    try {
      const top = trendDestinations?.[0];
      if (!top?.arrive) return;

      // ✅ 고정값 규칙(원하는대로 바꿔도 됨)
      const base = new Date();
      base.setDate(base.getDate() + 30); // 오늘+30일
      const yyyy = base.getFullYear();
      const mm = String(base.getMonth() + 1).padStart(2, "0");
      const dd = String(base.getDate()).padStart(2, "0");
      const departDate = `${yyyy}-${mm}-${dd}`;

      const searchParams = {
        tripType: "ONEWAY", // ✅ 고정
        depart: "ICN",      // ✅ 고정(서울)
        arrive: top.arrive, // ✅ 인기 목적지
        departDate,
        // 필요하면 너희 검색 DTO에 맞게 추가:
        adultCount: 1,
        minorCount: 0,
        cabin: "ECONOMY",
      };

      // ✅ TODO: 너희 “검색 시작” API 경로로 변경
      // 예) GET /api/flights/search (즉시 결과 + searchId 반환)
      const r = await api.get("/api/flights/search", { params: searchParams });

      // 응답 형태가 프로젝트마다 달라서, 아래는 흔한 케이스 2개를 방어
      const payload = r?.data;
      const res = Array.isArray(payload) ? payload : payload?.data ?? payload?.res ?? [];
      const searchId = payload?.searchId ?? payload?.id ?? null;

      navigate("/airline/list", {
        state: { searchParams, res, searchId },
      });
    } catch (e) {
      // 실패 시에는 메인 검색 화면으로 보내서 사용자가 직접 검색하게 해도 됨
      navigate("/", { state: { focus: "search" } });
    }
  };

  const handleClick = (id) => {
    if (id === 1) {
      navigate("/airline/list/price"); // 너희 가격변동 페이지 경로에 맞게
      return;
    }
    if (id === 2) {
      navigate("/alert"); // 너희 알림 페이지 경로에 맞게
      return;
    }
    if (id === 3) {
      handleQuickSearchTrend();
      return;
    }
  };

  return (
    <section className="insight">
      <div className="insight-head">
        <h2>TripType는 이렇게 다릅니다</h2>
        <p>가격을 단순 비교하지 않고, 흐름을 분석합니다</p>
      </div>

      <div className="insight-grid">
        {insights.map((item) => {
          const sub = item.id === 3 ? trendSubText : item.sub;

          return (
            <article className="insight-card" key={item.id}>
              <div className="insight-left">
                <div className="insight-icon">{item.icon}</div>

                <h3 className="insight-title">{item.title}</h3>

                <p className="insight-desc">
                  {item.desc.split("\n").map((line, idx) => (
                    <span key={idx}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>

                <span className="insight-sub">{sub}</span>
              </div>

              <div className={`insight-right type-${item.id}`}>
                <span className="insight-badge">{item.badge}</span>

                <button
                  className="insight-cta"
                  type="button"
                  onClick={() => handleClick(item.id)}
                  disabled={item.id === 3 && trendDestinations.length === 0}
                >
                  {item.cta}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default InsightSection;

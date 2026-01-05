import "../css/InsightSection.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../common/api/axiosInstance.js";

const InsightSection = () => {
  const navigate = useNavigate();

  const [popularRoutes, setPopularRoutes] = useState([]);
  const [priceMoves, setPriceMoves] = useState([]);
  const [surgeRoutes, setSurgeRoutes] = useState([]);

  // ✅ [TRACK용] 최근 검색 급증 로딩 상태만 추가
  const [surgeLoading, setSurgeLoading] = useState(false);

  const IATA_NAME = useMemo(
    () => ({
      ICN: "인천",
      GMP: "김포",
      NRT: "도쿄",
      HND: "도쿄(하네다)",
      KIX: "오사카(간사이)",
      FUK: "후쿠오카",
      DAD: "다낭",
      BKK: "방콕",
      DPS: "발리",
    }),
    []
  );

  const routeLabel = (code) => IATA_NAME[code] || code || "";

  const formatRouteText = (depart, arrive) => {
    const d = routeLabel(depart);
    const a = routeLabel(arrive);
    if (!depart && !arrive) return "(불러오는 중...)";
    if (depart && arrive) return `${d} → ${a}`;
    return `${d}${a}`;
  };

  const popularSubText = useMemo(() => {
    if (!popularRoutes || popularRoutes.length === 0) return "서울 → (불러오는 중...)";
    const names = popularRoutes.slice(0, 3).map((x) => routeLabel(x.arrive));
    return `서울 → ${names.join(" · ")}`;
  }, [popularRoutes, IATA_NAME]);

  const priceMoveSubText = useMemo(() => {
    if (!priceMoves || priceMoves.length === 0) return "(불러오는 중...)";
    const top = priceMoves[0];
    const route = formatRouteText(top.depart || "ICN", top.arrive);
    const pct = Number(top.changePct);

    if (Number.isFinite(pct)) {
      const sign = pct > 0 ? "▲" : pct < 0 ? "▼" : "–";
      const abs = Math.abs(pct);
      return `${route} 최근 ${top.days || 7}일 ${sign}${abs}%`;
    }
    return `${route} 최근 변동`;
  }, [priceMoves]);

  const surgeSubText = useMemo(() => {
    if (surgeLoading) return "(불러오는 중...)";
    if (!surgeRoutes || surgeRoutes.length === 0) return "(데이터 없음)";
    const top = surgeRoutes[0];
    const route = formatRouteText(top.depart || "ICN", top.arrive);
    const pct = Number(top.growthPct);

    if (Number.isFinite(pct)) return `${route} 검색 급증 +${pct}%`;
    return `${route} 검색 급증`;
  }, [surgeRoutes, surgeLoading]);

  const insights = useMemo(() => {
    return [
      {
        id: 1,
        icon: "🔥",
        badge: "TREND",
        title: "인기 검색 노선",
        desc: "최근 기간 동안 가장 많이 검색된\n노선을 빠르게 확인해보세요.",
        sub: popularSubText,
        cta: "바로 검색",
        disabled: popularRoutes.length === 0,
      },
      {
        id: 2,
        icon: "📉",
        badge: "PRICE",
        title: "최근 가격 변동 노선",
        desc: "최근 기간 동안 가격 변동이 있었던\n노선을 확인할 수 있어요.",
        sub: priceMoveSubText,
        cta: "가격 흐름 보기",
        disabled: priceMoves.length === 0,
      },
      {
        id: 3,
        icon: "🚀",
        badge: "SURGE",
        title: "최근 검색 급증 노선",
        desc: "최근 들어 검색이 빠르게 증가한\n노선을 확인해보세요.",
        sub: surgeSubText,
        cta: "바로 검색",
        // ✅ 핵심: "로딩 중"일 때만 비활성화. 빈 배열이어도 클릭 가능하게.
        disabled: surgeLoading,
      },
    ];
  }, [
    popularSubText,
    popularRoutes.length,
    priceMoveSubText,
    priceMoves.length,
    surgeSubText,
    surgeRoutes.length,
    surgeLoading,
  ]);

  const pickList = (resp) => {
    const d = resp?.data;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data)) return d.data;
    return [];
  };

  useEffect(() => {
    let cancelled = false;

    const safeSet = (setter, value) => {
      if (!cancelled) setter(value);
    };

    (async () => {
      try {
        const r1 = await api.get("/api/trends/routes", { params: { days: 7, limit: 3 } });
        safeSet(setPopularRoutes, pickList(r1));
      } catch (e) {
        safeSet(setPopularRoutes, []);
      }

      try {
        const r2 = await api.get("/api/trends/price-moves", { params: { days: 7, limit: 1 } });
        safeSet(setPriceMoves, pickList(r2));
      } catch (e) {
        safeSet(setPriceMoves, []);
      }

      // ✅ surge만 로딩 트래킹
      try {
        safeSet(setSurgeLoading, true);

        console.log("========================================");
        console.log("🚀 [InsightSection] surge API 호출 시작");
        console.log("➡️  GET /api/trends/surge params =", { days: 1, limit: 1 });

        const r3 = await api.get("/api/trends/surge", { params: { days: 1, limit: 1 } });

        console.log("✅ [InsightSection] surge API 응답 수신");
        console.log("📦 r3.status =", r3?.status);
        console.log("📦 r3.data =", r3?.data);

        const list = pickList(r3);
        console.log("📌 [InsightSection] pickList(r3) =", list);
        console.log("📌 [InsightSection] list.length =", list?.length ?? 0);

        safeSet(setSurgeRoutes, list);
        console.log("✅ [InsightSection] setSurgeRoutes 적용 완료(취소여부 반영)");
        console.log("========================================");
      } catch (e) {
        console.log("========================================");
        console.log("❌ [InsightSection] surge API 호출 실패");
        console.log("🧨 error.message =", e?.message);
        console.log("🧨 error.response?.status =", e?.response?.status);
        console.log("🧨 error.response?.data =", e?.response?.data);
        console.log("🧨 error.config?.url =", e?.config?.url);
        console.log("========================================");
        safeSet(setSurgeRoutes, []);
      } finally {
        safeSet(setSurgeLoading, false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const quickSearchToList = async ({ depart = "ICN", arrive }) => {
    if (!arrive) return;

    try {
      const base = new Date();
      base.setDate(base.getDate() + 30);
      const yyyy = base.getFullYear();
      const mm = String(base.getMonth() + 1).padStart(2, "0");
      const dd = String(base.getDate()).padStart(2, "0");
      const departDate = `${yyyy}-${mm}-${dd}`;

      const searchParams = {
        tripType: "ONEWAY",
        depart,
        arrive,
        departDate,
        adultCount: 1,
        minorCount: 0,
        cabin: "ECONOMY",
      };

      const r = await api.post("/api/flights/search", searchParams);

      const payload = r?.data;
      const res = Array.isArray(payload) ? payload : payload?.data ?? payload?.res ?? [];
      const searchId = payload?.searchId ?? payload?.id ?? null;

      navigate("/airline/list", { state: { searchParams, res, searchId } });
    } catch (e) {
      navigate("/", { state: { focus: "search" } });
    }
  };

  const handleClick = (id) => {
    if (id === 3) {
      console.log("========================================");
      console.log("🚀 [InsightSection] 최근 검색 급증 노선 CTA 클릭");
      console.log("📌 surgeLoading =", surgeLoading);
      console.log("📌 surgeRoutes =", surgeRoutes);
      console.log("📌 surgeRoutes.length =", surgeRoutes?.length ?? 0);

      const top = surgeRoutes?.[0];
      console.log("📌 top =", top);

      // ✅ 핵심: 데이터 없으면 '검색영역으로 이동'
      if (!top?.arrive) {
        console.log("⚠️ surgeRoutes 비어있음 → 홈 검색영역으로 이동");
        console.log("========================================");
        navigate("/", { state: { focus: "search" } });
        return;
      }

      console.log("➡️ quickSearchToList args =", {
        depart: top?.depart || "ICN",
        arrive: top?.arrive,
      });
      console.log("========================================");

      quickSearchToList({ depart: top?.depart || "ICN", arrive: top?.arrive });
      return;
    }

    if (id === 1) {
      const top = popularRoutes?.[0];
      quickSearchToList({ depart: top?.depart || "ICN", arrive: top?.arrive });
      return;
    }
    if (id === 2) {
      const top = priceMoves?.[0];
      if (top?.arrive) {
        quickSearchToList({ depart: top?.depart || "ICN", arrive: top?.arrive });
      } else {
        navigate("/airline/list/price");
      }
      return;
    }
  };

  useEffect(() => {
    console.log("========================================");
    console.log("🔄 [InsightSection] surgeRoutes state 변경됨");
    console.log("📌 surgeLoading =", surgeLoading);
    console.log("📌 surgeRoutes =", surgeRoutes);
    console.log("📌 surgeRoutes.length =", surgeRoutes?.length ?? 0);
    console.log("========================================");
  }, [surgeRoutes, surgeLoading]);

  return (
    <section className="insight">
      <div className="insight-head">
        <h2>TripType는 이렇게 다릅니다</h2>
        <p>검색/가격 데이터를 기반으로 흐름을 보여줍니다</p>
      </div>

      <div className="insight-grid">
        {insights.map((item) => (
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

              <span className="insight-sub">{item.sub}</span>
            </div>

            <div className={`insight-right type-${item.id}`}>
              <span className="insight-badge">{item.badge}</span>

              <button
                className="insight-cta"
                type="button"
                onClick={() => handleClick(item.id)}
                disabled={item.disabled}
              >
                {item.cta}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default InsightSection;

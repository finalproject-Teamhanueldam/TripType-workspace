import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDays, format } from "date-fns";
import api from "../../common/api/axiosInstance.js";
import "../css/RecommendSection.css";

// ✅ 리스트는 파일로 분리해서 import (main/component/data/destinations.js)
import { DESTINATIONS } from "./data/destinations.js";

const VISIBLE_COUNT = 3;
const AUTO_DELAY = 3500;
const GAP = 24;

// ✅ 설문 안 했을 때도 기본으로 보여줄 5개
const DEFAULT_DESTINATION_IDS = [1, 2, 3, 4, 5];

// ✅ 설문 했을 때도 “추천 5개만” 보여주기
const PERSONALIZED_COUNT = 5;

const RecommendSection = () => {

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const navigate = useNavigate();

  // null=로딩중, true=설문있음, false=설문없음
  const [hasSurvey, setHasSurvey] = useState(null);

  // 토큰 존재 여부를 state로 들고 있어야 로그아웃 즉시 블러 반영됨
  const [hasToken, setHasToken] = useState(
    Boolean(localStorage.getItem("accessToken"))
  );

  // ✅ 설문 결과(4축 점수)
  const [surveyScores, setSurveyScores] = useState(null); // {RELAX, CITY, NATURE, ACTIVITY}

  const [index, setIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  const trackRef = useRef(null);
  const timerRef = useRef(null);

  /* ===============================
     설문 존재 여부 조회 (+ 점수 저장)
  =============================== */
  const fetchSurveyExists = useCallback(async () => {
    const token = localStorage.getItem("accessToken");

    // 비로그인: 호출 X + 설문없음 처리
    if (!token) {
      setHasToken(false);
      setHasSurvey(false);
      setSurveyScores(null);
      return;
    }

    setHasToken(true);

    try {
      const { data } = await api.get("/api/survey/me");
      const exists = Boolean(data?.exists);
      setHasSurvey(exists);

      if (exists && data?.data) {
        const s = data.data;

        setSurveyScores({
          RELAX: Number(s.surveyRelaxScore ?? s.relaxScore ?? 0) || 0,
          CITY: Number(s.surveyCityScore ?? s.cityScore ?? 0) || 0,
          NATURE: Number(s.surveyNatureScore ?? s.natureScore ?? 0) || 0,
          ACTIVITY: Number(s.surveyActivityScore ?? s.activityScore ?? 0) || 0,
        });
      } else {
        setSurveyScores(null);
      }
    } catch {
      setHasSurvey(false);
      setSurveyScores(null);
    }
  }, []);

  useEffect(() => {
    fetchSurveyExists();
  }, [fetchSurveyExists]);

  /* ===============================
     로그인/로그아웃 상태 동기화
  =============================== */
  useEffect(() => {
    const syncAuthState = () => {
      const tokenExists = Boolean(localStorage.getItem("accessToken"));
      setHasToken(tokenExists);

      if (!tokenExists) {
        setHasSurvey(false);
        setSurveyScores(null);
        return;
      }

      fetchSurveyExists();
    };

    window.addEventListener("storage", syncAuthState);
    window.addEventListener("focus", syncAuthState);
    document.addEventListener("visibilitychange", syncAuthState);
    window.addEventListener("auth-changed", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("focus", syncAuthState);
      document.removeEventListener("visibilitychange", syncAuthState);
      window.removeEventListener("auth-changed", syncAuthState);
    };
  }, [fetchSurveyExists]);

  /* ===============================
     카드 폭 계산
  =============================== */
  useEffect(() => {
    if (!trackRef.current) return;

    const calc = () => {
      const firstCard = trackRef.current.querySelector(".dest-card");
      if (firstCard) setCardWidth(firstCard.offsetWidth);
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const stopAuto = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // 🔒 잠금 조건
  const locked = !hasToken || hasSurvey !== true;

  /* ===============================
     ✅ 설문 안 했을 때 기본 5개
  =============================== */
  const defaultDestinations = useMemo(() => {
    const picked = DESTINATIONS.filter((d) =>
      DEFAULT_DESTINATION_IDS.includes(d.id)
    );

    if (picked.length >= PERSONALIZED_COUNT) {
      return picked.slice(0, PERSONALIZED_COUNT);
    }

    const fill = DESTINATIONS.filter(
      (d) => !DEFAULT_DESTINATION_IDS.includes(d.id)
    ).slice(0, PERSONALIZED_COUNT - picked.length);

    return [...picked, ...fill].slice(0, PERSONALIZED_COUNT);
  }, []);

  /* ===============================
     ✅ 설문 했을 때: “취향에 맞는 5개만”
     - 핵심 수정:
       1) base를 전체 DESTINATIONS로 fallback 하지 말고 defaultDestinations로 fallback
       2) 최종 결과를 slice(0, 5)
  =============================== */
  const personalizedDestinations = useMemo(() => {
    // 설문 점수 없으면 기본 5개로
    if (!surveyScores) return defaultDestinations;

    // 1) 상위 2축
    const topAxes = Object.entries(surveyScores)
      .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
      .map(([ax]) => ax)
      .slice(0, 2);

    // 2) topAxes와 교집합 있는 목적지만 필터
    const filtered = DESTINATIONS.filter((d) =>
      (d.axes || []).some((ax) => topAxes.includes(ax))
    );

    // ✅ (중요) 필터가 너무 적으면 전체가 아니라 기본 5개로 fallback
    const base = filtered.length ? filtered : defaultDestinations;

    // 3) 점수합 정렬
    const scoreOf = (d) =>
      (d.axes || []).reduce((sum, ax) => sum + (surveyScores?.[ax] || 0), 0);

    // ✅ (중요) 최종 5개만
    return [...base].sort((a, b) => scoreOf(b) - scoreOf(a)).slice(0, PERSONALIZED_COUNT);
  }, [surveyScores, defaultDestinations]);

  /* ===============================
     ✅ 화면에 뿌릴 리스트 결정
  =============================== */
  const displayDestinations = useMemo(() => {
    return locked ? defaultDestinations : personalizedDestinations;
  }, [locked, defaultDestinations, personalizedDestinations]);

  /* ===============================
     캐러셀 인덱스 범위 계산
  =============================== */
  const maxIndex = useMemo(() => {
    return Math.max(displayDestinations.length - VISIBLE_COUNT, 0);
  }, [displayDestinations.length]);

  useEffect(() => {
    setIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const startAuto = useCallback(() => {
    stopAuto();
    if (maxIndex <= 0) return;

    timerRef.current = setTimeout(() => {
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, AUTO_DELAY);
  }, [maxIndex, stopAuto]);

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [index, startAuto, stopAuto]);

  const handlePrev = () => setIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setIndex((prev) => Math.min(prev + 1, maxIndex));

  /* ===============================
     ✅ 추천 클릭 시 자동 검색
  =============================== */
  const runAutoSearch = useCallback(
    async (dest) => {
      if (locked) return;
      if (!dest?.iata) return;

      try {
        const departDate = format(addDays(new Date(), 14), "yyyy-MM-dd");
        const returnDate = format(addDays(new Date(), 17), "yyyy-MM-dd");

        const searchParams = {
          tripType: "ROUND",
          depart: "ICN",
          arrive: dest.iata,
          departDate,
          returnDate,
          adultCount: 1,
          minorCount: 0,
        };

        const token = localStorage.getItem("accessToken");

        const { data } = await api.post("/api/flights/search", searchParams, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const searchId = data?.searchId;

        navigate("/airline/list", {
          state: {
            searchParams,
            searchId,
          },
        });
      } catch (err) {
        console.error("추천 검색 실패:", err);
      }
    },
    [locked, navigate]
  );

  return (
    <section className="recommend">
      <div className="recommend-head">
        <h2>당신의 취향에 맞는 추천 여행지</h2>
        <p>설문 결과를 바탕으로 지금 가장 잘 맞는 곳</p>
      </div>

      <div
        className={`recommend-carousel ${locked ? "locked" : ""}`}
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
      >
        <button
          className="carousel-arrow left"
          onClick={handlePrev}
          disabled={index === 0 || maxIndex === 0}
        >
          ‹
        </button>

        <div className="carousel-viewport">
          <div
            className="carousel-track"
            ref={trackRef}
            style={{
              transform: `translateX(-${index * (cardWidth + GAP)}px)`,
            }}
          >
            {displayDestinations.map((d) => (
              <article className="dest-card" key={d.id}>
                <img
                  src={d.img}
                  alt={d.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null; // ✅ 무한루프 방지
                    e.currentTarget.src =
                      `${API_BASE_URL}/logo_image/TripType_logo.png`;
                    e.currentTarget.classList.add("is-fallback-logo");
                  }}
                />
                <div className="dest-overlay">
                  <div>
                    <span className="dest-sub">{d.sub}</span>
                    <h3 className="dest-title">{d.name}</h3>
                  </div>
                  <div className="dest-bottom">
                    <span className="dest-price">최저가 {d.price}</span>
                    <button
                      className="dest-cta"
                      disabled={locked}
                      onClick={() => runAutoSearch(d)}
                      type="button"
                    >
                      항공권 보기
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <button
          className="carousel-arrow right"
          onClick={handleNext}
          disabled={index === maxIndex || maxIndex === 0}
        >
          ›
        </button>

        {locked && (
          <div className="survey-overlay" onClick={(e) => e.stopPropagation()}>
            <p>
              설문을 완료하면
              <br />
              맞춤 여행지를 확인할 수 있어요
            </p>
            <button type="button" onClick={() => navigate("/survey")}>
              취향 테스트 시작
            </button>
          </div>
        )}
      </div>

      <div className="carousel-dots">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <span
            key={i}
            className={`dot ${index === i ? "active" : ""}`}
            onClick={() => {
              if (!locked) setIndex(i);
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default RecommendSection;

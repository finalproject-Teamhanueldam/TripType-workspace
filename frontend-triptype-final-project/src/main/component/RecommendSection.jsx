import { useEffect, useRef, useState } from "react";
import "../css/RecommendSection.css";

const destinations = [
  { id: 1, name: "발리", sub: "휴양 · 힐링", price: "₩512,000~", img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop" },
  { id: 2, name: "도쿄", sub: "도시 · 미식", price: "₩289,000~", img: "https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1600&auto=format&fit=crop" },
  { id: 3, name: "파리", sub: "로맨틱 · 문화", price: "₩921,000~", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop" },
  { id: 4, name: "방콕", sub: "도시 · 휴양", price: "₩412,000~", img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1600&auto=format&fit=crop" },
  { id: 5, name: "뉴욕", sub: "도시 · 문화", price: "₩1,120,000~", img: "https://images.unsplash.com/photo-1549921296-3fd62f6c3bce?q=80&w=1600&auto=format&fit=crop" },
];

const VISIBLE_COUNT = 3;
const AUTO_DELAY = 3500;
const GAP = 24;

const RecommendSection = () => {
  /* 🔥 설문 완료 여부 (임시 하드코딩) */
  const [hasSurvey, setHasSurvey] = useState(false);

  const [index, setIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const trackRef = useRef(null);
  const timerRef = useRef(null);

  const maxIndex = destinations.length - VISIBLE_COUNT;

  /* 카드 실제 폭 계산 */
  useEffect(() => {
    if (trackRef.current) {
      const firstCard = trackRef.current.querySelector(".dest-card");
      if (firstCard) setCardWidth(firstCard.offsetWidth);
    }
  }, []);

  /* 자동 슬라이드 */
  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [index]);

  const startAuto = () => {
    stopAuto();
    timerRef.current = setTimeout(() => {
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, AUTO_DELAY);
  };

  const stopAuto = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handlePrev = () => setIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setIndex((prev) => Math.min(prev + 1, maxIndex));

  return (
    <section className="recommend">
      <div className="recommend-head">
        <h2>당신의 취향에 맞는 추천 여행지</h2>
        <p>설문 결과를 바탕으로 지금 가장 잘 맞는 곳</p>
      </div>

      <div
        className={`recommend-carousel ${!hasSurvey ? "locked" : ""}`}
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
      >
        <button
          className="carousel-arrow left"
          onClick={handlePrev}
          disabled={index === 0}
        >
          ‹
        </button>

        <div className="carousel-viewport">
          <div
            className="carousel-track"
            ref={trackRef}
            style={{
              transform: `translateX(-${index * (cardWidth + GAP)}px)`
            }}
          >
            {destinations.map((d) => (
              <article className="dest-card" key={d.id}>
                <img src={d.img} alt={d.name} />
                <div className="dest-overlay">
                  <div>
                    <span className="dest-sub">{d.sub}</span>
                    <h3 className="dest-title">{d.name}</h3>
                  </div>
                  <div className="dest-bottom">
                    <span className="dest-price">최저가 {d.price}</span>
                    <button className="dest-cta">항공권 보기</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <button
          className="carousel-arrow right"
          onClick={handleNext}
          disabled={index === maxIndex}
        >
          ›
        </button>

        {/* 🔒 설문 미완료 오버레이 */}
        {!hasSurvey && (
          <div
            className="survey-overlay"
            onClick={() => setHasSurvey(true)} // 🔧 개발용 토글
          >
            <p>
              설문을 완료하면<br />
              맞춤 여행지를 확인할 수 있어요
            </p>
            <button>취향 테스트 시작</button>
            <span className="dev-hint">
              ※ 개발용: 클릭 시 설문 완료 처리
            </span>
          </div>
        )}
      </div>

      {/* 🔵 DOT 인디케이터 */}
      <div className="carousel-dots">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <span
            key={i}
            className={`dot ${index === i ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      {/* 🔧 개발용 토글 버튼 (나중에 제거) */}
      <button
        style={{ marginTop: "20px" }}
        onClick={() => setHasSurvey((prev) => !prev)}
      >
        개발용: 설문 상태 토글
      </button>
    </section>
  );
};

export default RecommendSection;

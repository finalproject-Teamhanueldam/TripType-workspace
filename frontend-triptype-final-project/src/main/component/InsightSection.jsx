import "../css/InsightSection.css";

const insights = [
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
    sub: "서울 → 도쿄 · 다낭 · 후쿠오카",
    cta: "바로 검색",
  },
];

const InsightSection = () => {
  return (
    <section className="insight">
      <div className="insight-head">
        <h2>TripType는 이렇게 다릅니다</h2>
        <p>가격을 단순 비교하지 않고, 흐름을 분석합니다</p>
      </div>

      <div className="insight-grid">
        {insights.map((item) => (
          <article className="insight-card" key={item.id}>
            
            {/* 좌측 콘텐츠 영역 */}
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

            {/* 우측 시각 앵커 영역 */}
            <div className={`insight-right type-${item.id}`}>
              <span className="insight-badge">{item.badge}</span>

              <button className="insight-cta">
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

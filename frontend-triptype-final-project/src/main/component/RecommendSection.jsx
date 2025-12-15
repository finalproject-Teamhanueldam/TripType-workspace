import "../style/RecommendSection.css";

const RecommendSection = () => {
  return (
    <section className="recommend-section">
      <h2>당신의 취향에 맞는 추천 여행지</h2>

      <div className="recommend-list">
        <div className="destination-card">발리 🌴</div>
        <div className="destination-card">도쿄 🗼</div>
        <div className="destination-card">파리 🇫🇷</div>
      </div>
    </section>
  );
};

export default RecommendSection;

import FilterSection from "./filter/FilterSection";
import "../style/HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-inner">

        {/* 상단 타이틀 */}
        <h1 className="hero-title">
          취향설문으로 나에게 딱 맞는 항공권과 여행지, 검색 한 번으로 찾습니다.
        </h1>
        <p className="hero-sub">당신에게 맞춘 여행을 지금 바로 시작하세요.</p>

        {/* 검색 섹션 (흰색 박스 전체) */}
        <div className="hero-filter-section">
          <p className="hero-filter-sub">
            원하는 조건을 선택하고 검색해보세요
          </p>

          {/* 검색 박스 (카드) */}
          <div className="hero-filter-box">
            <FilterSection />
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;

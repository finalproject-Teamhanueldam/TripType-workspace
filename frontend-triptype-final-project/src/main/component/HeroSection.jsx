import FilterSection from "./FilterSection";
import "../style/HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-inner">

        {/* 상단 타이틀 */}
        <h1 className="hero-title">
          수백만 개의 저가 항공권. 검색 한 번으로 간단하게.
        </h1>

        {/* 필터 박스 (하얀 박스 + 그림자) */}
        <div className="hero-filter-box">
          <FilterSection />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;

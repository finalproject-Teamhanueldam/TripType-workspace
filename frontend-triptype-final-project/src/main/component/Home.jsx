import "../css/Home.css";
import CommentTopSection from "./CommentTopSection";
import RecommendSection from "./RecommendSection";
import InsightSection from "./InsightSection";

const Home = () => {
  return (
    <main className="content-area">
      <div className="page-wrap">
      {/* 1️⃣ 취향 기반 추천 */}
      <RecommendSection />

      {/* 2️⃣ 이해·신뢰 형성 */}
      <InsightSection />

      {/* 3️⃣ 커뮤니티 */}
      <CommentTopSection />

      </div>
    </main>
  );
};

export default Home;

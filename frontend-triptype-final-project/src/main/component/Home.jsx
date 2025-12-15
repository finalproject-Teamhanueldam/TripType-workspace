import "../style/Home.css";
import CommentTopSection from "./CommentTopSection";
import RecommendSection from "./RecommendSection";

const Home = () => {
  return (
    <main className="content-area">
      <div className="page-wrap">
        <CommentTopSection />
        <RecommendSection />
      </div>
    </main>
  );
};

export default Home;

import "../css/CommentTopSection.css";
import UserFaqPage from "../../faq/component/UserFaqPage";

const CommentTopSection = () => {
  return (
    <section className="comment-section">
      <div className="comment-head">
        <h2>자주 묻는 질문(FAQ)</h2>
        <span className="comment-badge">FAQ</span>
      </div>

      {/* ✅ page-wrap max-width를 무시하고 화면 전체폭으로 탈출 */}
      <div className="faq-fullbleed">
        <div className="faq-wrapper">
          <UserFaqPage mode="home" />
        </div>
      </div>
    </section>

    
  );
  console.log("CommentTopSection render");
};

export default CommentTopSection;

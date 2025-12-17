import "../css/UserFaqPage.css";
import { useState } from "react";
import FaqCategoryTabs from "./FaqCategoryTabs";
import FaqList from "./FaqList";

function UserFaqPage() {
  const [category, setCategory] = useState("ALL");
  const [keyword, setKeyword] = useState("");

  return (
    <div className="faq-page">
      <h2 className="faq-title">자주 묻는 질문</h2>
      <p className="faq-desc">
        항공권 예약, 결제, 변경과 관련된 주요 질문을 확인해보세요.
      </p>

      {/* 검색창 */}
      <div className="faq-search-wrapper">
        {/* <span className="faq-search-icon">🔍</span> */}
        <input
          className="faq-search"
          placeholder="궁금한 내용을 검색해보세요"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
      </div>

      <FaqCategoryTabs current={category} onChange={setCategory} />
      <FaqList category={category} keyword={keyword} />
    </div>
  );
}

export default UserFaqPage;

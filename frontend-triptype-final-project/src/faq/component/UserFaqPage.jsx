import "../css/UserFaqPage.css";
import { useState } from "react";
import FaqCategoryTabs from "./FaqCategoryTabs";
import FaqList from "./FaqList";

function UserFaqPage({ mode = "page", hideHeader = false, hideSearch = false }) {
  const [category, setCategory] = useState("ALL");
  const [keyword, setKeyword] = useState("");

  const isHome = mode === "home";

  return (
    <div className="faq-page">
      {!hideHeader && !isHome && (
        <>
          <h2 className="faq-title">자주 묻는 질문</h2>
          <p className="faq-desc">
            항공권 예약, 결제, 변경과 관련된 주요 질문을 확인해보세요.
          </p>
        </>
      )}

      {/* ✅ Home에서 검색창 숨기고 싶으면: <UserFaqPage mode="home" hideSearch /> */}
      {!hideSearch && (
        <div className="faq-search-wrapper">
          <input
            className="faq-search"
            placeholder="궁금한 내용을 검색해보세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      )}

      <FaqCategoryTabs current={category} onChange={setCategory} />

      {/* ✅ 딱 1번만 렌더 */}
      <FaqList
        category={category}
        keyword={keyword}
        disableAutoScroll={isHome}
        pageSize={isHome ? 5 : 10}   // ✅ 메인에서만 5개
      />
    </div>
  );
}

export default UserFaqPage;

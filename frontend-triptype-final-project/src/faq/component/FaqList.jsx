import { useState, useRef, useEffect } from "react";
import FaqItem from "./FaqItem";
import { FaqData } from "../data/FaqData";

const PAGE_SIZE = 10;

function FaqList({ category, keyword }) {
  const [openId, setOpenId] = useState(null);
  const [page, setPage] = useState(1);
  const itemRefs = useRef({});

  /* 🔄 카테고리 / 검색 변경 시 초기화 */
  useEffect(() => {
    setOpenId(null);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [category, keyword]);

  const filtered = FaqData.filter(f =>
    (category === "ALL" || f.category === category) &&
    f.question.toLowerCase().includes(keyword.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const pagedList = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleToggle = (id) => {
    setOpenId(prev => (prev === id ? null : id));

    setTimeout(() => {
      itemRefs.current[id]?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  };

  if (filtered.length === 0) {
    return <div className="faq-empty">검색 결과가 없습니다.</div>;
  }

  return (
    <>
      <div>
        {pagedList.map(faq => (
          <div
            key={faq.id}
            ref={el => (itemRefs.current[faq.id] = el)}
          >
            <FaqItem
              faq={faq}
              open={openId === faq.id}
              onToggle={() => handleToggle(faq.id)}
              keyword={keyword}
            />
          </div>
        ))}
      </div>

      {/* ✅ 페이지네이션 */}
      <div className="faq-pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
          <button
            key={num}
            className={`page-btn ${page === num ? "active" : ""}`}
            onClick={() => {
              setPage(num);
              setOpenId(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {num}
          </button>
        ))}
      </div>
    </>
  );
}

export default FaqList;

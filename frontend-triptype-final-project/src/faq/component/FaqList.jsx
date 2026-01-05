import { useState, useRef, useEffect, useMemo } from "react";
import FaqItem from "./FaqItem";
import { FaqData } from "../data/FaqData";

function FaqList({
  category,
  keyword,
  disableAutoScroll = false,
  pageSize = 10, // ✅ 기본 10, Home에서는 5로 내려줌
}) {
  const [openId, setOpenId] = useState(null);
  const [page, setPage] = useState(1);
  const itemRefs = useRef({});

  // ✅ 필터링
  const filtered = useMemo(() => {
    const kw = (keyword || "").toLowerCase();
    return FaqData.filter(
      (f) =>
        (category === "ALL" || f.category === category) &&
        f.question.toLowerCase().includes(kw)
    );
  }, [category, keyword]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  const pagedList = useMemo(() => {
    return filtered.slice((page - 1) * pageSize, page * pageSize);
  }, [filtered, page, pageSize]);

  /* 🔄 카테고리 / 검색 변경 시 초기화 */
  useEffect(() => {
    setOpenId(null);
    setPage(1);

    if (!disableAutoScroll) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [category, keyword, disableAutoScroll]);

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));

    // ✅ 메인에서는 스크롤 이동도 꺼버리려면 여기서도 막아야 함
    if (disableAutoScroll) return;

    setTimeout(() => {
      itemRefs.current[id]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  if (filtered.length === 0) {
    return <div className="faq-empty">검색 결과가 없습니다.</div>;
  }

  return (
    <>
      <div>
        {pagedList.map((faq) => (
          <div key={faq.id} ref={(el) => (itemRefs.current[faq.id] = el)}>
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
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`page-btn ${page === num ? "active" : ""}`}
            onClick={() => {
              setPage(num);
              setOpenId(null);

              if (!disableAutoScroll) {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
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

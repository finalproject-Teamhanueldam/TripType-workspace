export function HighlightText(text, keyword) {
  if (!keyword) return text;

  const regex = new RegExp(`(${keyword})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, idx) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <mark key={idx} className="faq-highlight">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

// ok 좋고 정렬 (최신순 / 조회수순 / 중요공지 상단고정) 이거 마저 구현하고 검색창 디자인
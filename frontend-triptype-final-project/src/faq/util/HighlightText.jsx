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


import "../css/FaqCategoryTabs.css";

const categories = [
  { key: "ALL", label: "전체" },
  { key: "RESERVE", label: "예약" },
  { key: "PAY", label: "결제" },
  { key: "CHANGE", label: "변경/환불" },
  { key: "ETC", label: "기타" }
];

function FaqCategoryTabs({ current, onChange }) {
  return (
    <div className="faq-tabs">
      {categories.map(c => (
        <button
          key={c.key}
          className={current === c.key ? "active" : ""}
          onClick={() => onChange(c.key)}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

export default FaqCategoryTabs;

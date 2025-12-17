import "../css/FaqItem.css";
import { highlightText } from "../util/highlightText";

function FaqItem({ faq, open, onToggle, keyword }) {
  return (
    <div className={`faq-item ${open ? "active" : ""}`}>
      <div className="faq-question" onClick={onToggle}>
        <div className="faq-question-left">
          <span className="q-badge">Q</span>
          <span className="question-text">
            {highlightText(faq.question, keyword)}
          </span>
        </div>
        <span className={`toggle-icon ${open ? "" : "open"}`}>
           ❯
        </span>
      </div>

      <div
        className="faq-answer-wrapper"
        style={{
          maxHeight: open ? "500px" : "0",
          opacity: open ? 1 : 0
        }}
      >
        <div className="faq-answer">
          {highlightText(faq.answer, keyword)}
        </div>
      </div>
    </div>
  );
}

export default FaqItem;

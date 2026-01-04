// survey/page/question/QuestionPage.jsx
import "../../css/page/QuestionPage.css";
import { useOutletContext } from "react-router-dom";

const QuestionPage = () => {
  const {
    mode = "page",
    step,
    total,
    currentQuestion,
    answers,
    onSelect,
    onNext,
    onPrev,
    onClose,
  } = useOutletContext();

  const question = currentQuestion;
  const selectedOptionId = question ? answers?.[question.id] : null;

  // ✅ 방어: question 없으면 렌더 안 함
  if (!question) return null;

  const progress = Math.round(((step + 1) / total) * 100);

  return (
    <div className="surveyWrap">
      <div className={`surveyCard survey-question ${mode}`}>
        <div className="survey-top">
          <div className="survey-progress">
            <div className="survey-progress-bar">
              <div
                className="survey-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="survey-progress-text">
              {step + 1} / {total}
            </div>
          </div>

          {mode === "modal" && typeof onClose === "function" && (
            <button className="survey-close" type="button" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        <h2 className="survey-q">{question.text}</h2>

        <div className="survey-options">
          {question.options.map((opt) => {
            const active = selectedOptionId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                className={`survey-option ${active ? "active" : ""}`}
                onClick={() => onSelect(question.id, opt.id)}
              >
                {opt.text}
              </button>
            );
          })}
        </div>

        <div className="survey-actions">
          <button
            type="button"
            className="survey-btn ghost"
            onClick={onPrev}
            disabled={step === 0}
          >
            이전
          </button>

          <button
            type="button"
            className="survey-btn primary"
            onClick={onNext}
            disabled={!selectedOptionId}
          >
            {step === total - 1 ? "결과보기" : "다음"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;

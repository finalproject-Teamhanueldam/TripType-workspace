// member/auth/component/survey/SurveyPopupModal.jsx
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

// ✅ 이미 있는 문항/축 그대로 사용 (경로 유지)
import {
  QUESTIONS,
  AXES,
  QUESTION_COUNT,
} from "../../../../survey/component/question/question.js";

// ✅ 이미 있는 결과 로직 그대로 사용 (경로 유지)
import { computeType } from "../../../../survey/component/result/computeType";

// ✅ 결과 UI 유틸
import {
  AXIS_LABEL,
  getAxisMax,
  toPercent,
  toTenScale,
} from "../../../../survey/component/result/scoreUtils";

import "../../css/SurveyPopupModal.css";

function SurveyPopupModal({ open, onClose, onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setAnswers({});
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const currentQuestion = useMemo(() => {
    if (step < 1 || step > QUESTION_COUNT) return null;
    return QUESTIONS[step - 1];
  }, [step]);

  const progress = useMemo(() => {
    if (step <= 0) return 0;
    if (step > QUESTION_COUNT) return 100;
    return Math.round((step / QUESTION_COUNT) * 100);
  }, [step]);

  const isAnsweredCurrent = useMemo(() => {
    if (!currentQuestion) return false;
    return Boolean(answers[currentQuestion.id]);
  }, [answers, currentQuestion]);

  const pickOption = (q, opt) => {
    setAnswers((prev) => ({
      ...prev,
      [q.id]: opt,
    }));
  };

  const goNext = () => {
    if (step === 0) {
      setStep(1);
      return;
    }

    if (step >= 1 && step <= QUESTION_COUNT) {
      if (!currentQuestion) return;

      if (!answers[currentQuestion.id]) {
        toast.info("선택지를 하나 골라주세요.");
        return;
      }

      if (step === QUESTION_COUNT) {
        setStep(QUESTION_COUNT + 1);
        return;
      }

      setStep((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (step <= 0) return;
    if (step === 1) {
      setStep(0);
      return;
    }
    if (step > 1 && step <= QUESTION_COUNT) {
      setStep((prev) => prev - 1);
      return;
    }
    if (step === QUESTION_COUNT + 1) {
      setStep(QUESTION_COUNT);
      return;
    }
  };

  const computed = useMemo(() => {
    const selected = Object.values(answers);

    const scores = AXES.reduce((acc, k) => {
      acc[k] = 0;
      return acc;
    }, {});

    selected.forEach((opt) => {
      AXES.forEach((k) => {
        scores[k] += Number(opt?.score?.[k] ?? 0);
      });
    });

    const typeMeta = computeType(scores);
    return { scores, typeMeta };
  }, [answers]);

  const handleComplete = () => {
    if (Object.keys(answers).length < QUESTION_COUNT) {
      toast.info("아직 답하지 않은 문항이 있어요.");
      return;
    }

    onComplete?.({
      scores: computed.scores,
      type: computed.typeMeta,
      answers,
    });
  };

  if (!open) return null;

  return (
    <div
      className="fullscreen-overlay tts-survey-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="overlay-content tts-survey-content"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="close-overlay tts-survey-close"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="overlay-body tts-survey-body">
          {/* 헤더/프로그레스 */}
          <div className="tts-survey-header">
            <h2 className="tts-survey-title">여행 스타일 분석</h2>
            <p className="tts-survey-subtitle">
              {step === 0
                ? "1분이면 끝나요. 취향에 맞는 여행을 추천해드릴게요."
                : step <= QUESTION_COUNT
                ? `문항 ${step} / ${QUESTION_COUNT}`
                : "결과 확인"}
            </p>

            {step > 0 && step <= QUESTION_COUNT && (
              <div className="tts-survey-progressTrack">
                <div
                  className="tts-survey-progressFill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          {/* STEP 0: 인트로 */}
          {step === 0 && (
            <div className="tts-survey-section">
              <div className="tts-survey-introText">
                총 {QUESTION_COUNT}문항 · 각 문항은 한 개만 선택합니다.
              </div>

              <div className="tts-survey-actionRow tts-survey-actionRow--end">
                <button
                  type="button"
                  className="tts-survey-btn tts-survey-btn--ghost"
                  onClick={onClose}
                >
                  나중에 할게요
                </button>
                <button
                  type="button"
                  className="tts-survey-btn tts-survey-btn--primary"
                  onClick={goNext}
                >
                  시작하기
                </button>
              </div>
            </div>
          )}

          {/* STEP 1~7: 문항 */}
          {step >= 1 && step <= QUESTION_COUNT && currentQuestion && (
            <div className="tts-survey-section">
              <div className="tts-survey-question">{currentQuestion.text}</div>

              <div className="tts-survey-options">
                {currentQuestion.options.map((opt) => {
                  const selected = answers[currentQuestion.id]?.id === opt.id;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => pickOption(currentQuestion, opt)}
                      className={`tts-survey-optionBtn ${
                        selected ? "is-selected" : ""
                      }`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              <div className="tts-survey-actionRow tts-survey-actionRow--between">
                <button
                  type="button"
                  className="tts-survey-btn tts-survey-btn--ghost"
                  onClick={goPrev}
                >
                  이전
                </button>

                <button
                  type="button"
                  className="tts-survey-btn tts-survey-btn--primary"
                  onClick={goNext}
                  disabled={!isAnsweredCurrent}
                >
                  {step === QUESTION_COUNT ? "결과 보기" : "다음"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: 결과 */}
          {step === QUESTION_COUNT + 1 && (
            <div className="tts-survey-section">
              <div className="tts-survey-resultHead">
                <div className="tts-survey-resultBadge">설문 결과</div>
                <div className="tts-survey-resultTitle">
                  {computed.typeMeta?.title || "결과"}
                </div>
                <div className="tts-survey-resultDesc">
                  {computed.typeMeta?.desc || ""}
                </div>
              </div>

              <div className="tts-survey-bars">
                {Object.keys(AXIS_LABEL).map((k) => {
                  const v = computed.scores?.[k] ?? 0;
                  const max = getAxisMax(k);
                  const pct = toPercent(v, k);
                  const ten = toTenScale(v, k);

                  return (
                    <div className="tts-survey-barRow" key={k}>
                      <div className="tts-survey-barTop">
                        <div className="tts-survey-barLabel">{AXIS_LABEL[k]}</div>
                        <div className="tts-survey-barValue">
                          {ten}/10{" "}
                          <span className="tts-survey-barSub">
                            ({v}/{max})
                          </span>
                        </div>
                      </div>

                      <div className="tts-survey-barTrack">
                        <div
                          className="tts-survey-barFill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="tts-survey-actionRow tts-survey-actionRow--between">
                <button
                  type="button"
                  className="tts-survey-btn tts-survey-btn--ghost"
                  onClick={goPrev}
                >
                  이전
                </button>

                <button
                  type="button"
                  className="tts-survey-btn tts-survey-btn--primary"
                  onClick={handleComplete}
                >
                  완료
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SurveyPopupModal;

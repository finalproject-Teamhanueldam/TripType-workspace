// survey/component/common/SurveyShell.jsx
import { useMemo, useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { QUESTIONS, AXES } from "../question/question.js";

const STORAGE_KEY = "triptype_survey_progress_v1";

const initScores = () =>
  AXES.reduce((acc, k) => {
    acc[k] = 0;
    return acc;
  }, {});

const addScore = (base, delta) => {
  const next = { ...base };
  AXES.forEach((k) => {
    next[k] = (next[k] || 0) + (delta?.[k] || 0);
  });
  return next;
};

const subScore = (base, delta) => {
  const next = { ...base };
  AXES.forEach((k) => {
    next[k] = (next[k] || 0) - (delta?.[k] || 0);
  });
  return next;
};

const SurveyShell = ({ mode = "page", onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState(initScores());

  const total = QUESTIONS.length;
  const isLastQuestionIndex = step >= total - 1;

  const currentQuestion = useMemo(() => QUESTIONS[step] || null, [step]);

  // ✅ (1) 최초 1회: sessionStorage 복구
  // ✅ 요구사항 반영:
  // - 설문 진행/결과 저장 전까지 새로고침해도 유지되어야 하므로 복구는 유지
  // - 단, "시작하기/새로하기" 눌렀을 때는 무조건 초기화 후 시작해야 하므로,
  //   location.state.startFresh === true 로 들어오면 복구를 스킵한다.
  useEffect(() => {
    try {
      if (location.state?.startFresh === true) {
        sessionStorage.removeItem(STORAGE_KEY);
        setStep(0);
        setAnswers({});
        setScores(initScores());
        return;
      }

      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);

      if (typeof parsed?.step === "number") setStep(parsed.step);
      if (parsed?.answers && typeof parsed.answers === "object")
        setAnswers(parsed.answers);
      if (parsed?.scores && typeof parsed.scores === "object")
        setScores(parsed.scores);
    } catch {
      // 깨진 값이면 무시
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ (2) 상태 변경될 때마다 저장
  // ✅ 요구사항 반영:
  // - 결과 저장 전까지 새로고침해도 유지되어야 하므로 계속 저장
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ step, answers, scores }));
    } catch {
      // 저장 실패하면 무시
    }
  }, [step, answers, scores]);

  const selectOption = (questionId, optionId) => {
    const q = QUESTIONS.find((x) => x.id === questionId);
    if (!q) return;

    const nextOpt = q.options.find((o) => o.id === optionId);
    if (!nextOpt) return;

    const prevOptionId = answers[questionId];
    const prevOpt = prevOptionId ? q.options.find((o) => o.id === prevOptionId) : null;

    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));

    setScores((prev) => {
      let next = prev;
      if (prevOpt) next = subScore(next, prevOpt.score);
      next = addScore(next, nextOpt.score);
      return next;
    });
  };

  const next = () => {
    const q = QUESTIONS[step];
    if (!q) return;

    const selected = answers[q.id];
    if (!selected) return;

    if (isLastQuestionIndex) {
      navigate("/survey/result");
      return;
    }

    setStep(step + 1);

    if (!location.pathname.startsWith("/survey/question")) {
      navigate("/survey/question");
    }
  };

  const prev = () => {
    if (step <= 0) return;
    setStep(step - 1);

    if (!location.pathname.startsWith("/survey/question")) {
      navigate("/survey/question");
    }
  };

  // ✅ 설문 처음부터(저장소도 같이 초기화)
  // - "새로하기/다시하기" 버튼이 이걸 호출하면 됨
  const reset = () => {
    setStep(0);
    setAnswers({});
    setScores(initScores());
    sessionStorage.removeItem(STORAGE_KEY);

    // ✅ /survey로 가면 GatePage에서 다시 시작/새로하기 선택 UI를 보여줄 수 있음
    // ✅ 만약 GatePage에서 "시작하기" 누르면 무조건 초기화라면 startFresh로 진입시키면 됨
    navigate("/survey", { replace: true });
  };

  // ✅ "시작하기"도 무조건 초기화가 요구사항
  // - 단, 결과 저장 전 새로고침 유지 목적은 "진행 중"일 때이므로
  //   사용자가 명시적으로 시작하기/새로하기를 누르면 초기화가 맞다.
  const startSurvey = () => {
    setStep(0);
    setAnswers({});
    setScores(initScores());
    sessionStorage.removeItem(STORAGE_KEY);

    // ✅ 질문 페이지로 이동
    navigate("/survey/question", {
      replace: true,
      // ✅ 혹시 SurveyShell이 언마운트/리마운트 타이밍에서 복구가 걸리는 경우를 대비
      state: { startFresh: true },
    });
  };

  // ✅ 저장 성공 후 외부에서 호출 가능하도록 clear 제공(선택)
  // - ResultPage에서 DB 저장 성공하면 반드시 이걸 호출해서 임시 진행값 삭제
  const clearProgress = () => {
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <Outlet
      context={{
        mode,
        onClose,

        QUESTIONS,
        AXES,
        total,
        step,
        currentQuestion,
        answers,
        scores,

        onSelect: selectOption,
        onNext: next,
        onPrev: prev,

        // ✅ "새로하기/다시하기" → 초기화 + /survey로
        onReset: reset,

        // ✅ "시작하기" → 무조건 초기화 + 질문 시작
        onStart: startSurvey,

        // ✅ ResultPage에서 “저장 성공” 후 진행값 삭제할 때 사용 가능
        clearProgress,
      }}
    />
  );
};

export default SurveyShell;

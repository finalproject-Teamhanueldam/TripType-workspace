// survey/page/result/ResultPage.jsx
import "../../css/page/ResultPage.css";

import api from "../../../common/api/axiosInstance.js"; // ✅ 너희 api.js 경로에 맞춰서 조정
import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { computeType } from "../result/computeType";
import { AXIS_LABEL, getAxisMax, toPercent, toTenScale } from "../result/scoreUtils";

const STORAGE_KEY = "triptype_survey_progress_v1";

const ResultPage = () => {
  const navigate = useNavigate();

  // ✅ SurveyShell(Outlet)에서 내려주는 값 받기
  const { mode = "page", scores, onReset, onClose, clearProgress } = useOutletContext();

  // ✅ 새로고침 대비: Outlet context가 날아가도 sessionStorage에서 복구
  const [fallbackScores, setFallbackScores] = useState(null);

  useEffect(() => {
    // scores가 이미 있으면 그대로 사용
    const hasCtxScores =
      scores &&
      typeof scores === "object" &&
      Object.keys(AXIS_LABEL).every((k) => typeof scores?.[k] === "number");

    if (hasCtxScores) return;

    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (parsed?.scores && typeof parsed.scores === "object") {
        setFallbackScores(parsed.scores);
      }
    } catch {
      // 깨진 값이면 무시
    }
  }, [scores]);

  // ✅ 렌더/저장에 사용할 점수 확정
  const finalScores = useMemo(() => {
    const hasCtxScores =
      scores &&
      typeof scores === "object" &&
      Object.keys(AXIS_LABEL).every((k) => typeof scores?.[k] === "number");

    if (hasCtxScores) return scores;

    const hasFallback =
      fallbackScores &&
      typeof fallbackScores === "object" &&
      Object.keys(AXIS_LABEL).every((k) => typeof fallbackScores?.[k] === "number");

    if (hasFallback) return fallbackScores;

    // 완전 비어있으면 0으로 처리(단, UX상 아래에서 안내)
    const zero = {};
    Object.keys(AXIS_LABEL).forEach((k) => (zero[k] = 0));
    return zero;
  }, [scores, fallbackScores]);

  // ✅ 11개 타입 판정 로직(computeType.js)
  const type = computeType(finalScores);

  // ✅ 결과 저장 로직
  const handleSaveResult = async () => {
    try {
      // ✅ 토큰 없으면 차단 (request interceptor가 붙이더라도, 여기서 UX 처리)
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("로그인이 필요합니다.");
        return;
      }

      const payload = {
        typeCode: type.typeCode,
        relaxScore: finalScores?.RELAX ?? 0,
        cityScore: finalScores?.CITY ?? 0,
        natureScore: finalScores?.NATURE ?? 0,
        activityScore: finalScores?.ACTIVITY ?? 0,
      };

      // ✅ api 인스턴스 사용 (Authorization 자동 첨부)
      const res = await api.post("/api/survey/save", payload);

      if (res?.data?.success === false) {
        toast.error(res?.data?.message || "설문 결과 저장 실패");
        return;
      }

      // ✅ 저장 성공 알림
      toast.success("설문 결과가 저장되었습니다.");

      // ✅ 저장 성공 시: 진행상태(sessionStorage) 제거 (결과저장 전까지는 유지, 저장 후 삭제)
      try {
        if (typeof clearProgress === "function") {
          clearProgress();
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        // 무시
      }

      // ✅ 저장 완료 후 이동
      if (mode === "modal") {
        if (typeof onClose === "function") {
          onClose();
          return;
        }
      }

      navigate("/");
    } catch (e) {
      console.error(e);
      toast.error("설문 결과 저장 실패");
    }
  };

  // ✅ 완전 새로고침 + storage에도 없어서 점수가 0으로만 나오는 경우 안내(선택)
  const hasAnyProgress =
    (finalScores?.RELAX ?? 0) +
      (finalScores?.CITY ?? 0) +
      (finalScores?.NATURE ?? 0) +
      (finalScores?.ACTIVITY ?? 0) >
    0;

  return (
    <div className="surveyWrap">
      <div className={`surveyCard survey-result ${mode}`}>
        <div className="survey-top">
          <div>
            <div className="surveyBadge">설문 결과</div>
            <h2 className="resultTitle">{type.title}</h2>
            <p className="resultDesc">{type.desc}</p>

            {!hasAnyProgress && (
              <p className="resultDesc" style={{ marginTop: 8 }}>
                진행 중 데이터가 없어 기본값으로 표시될 수 있습니다. 설문을 다시 진행해 주세요.
              </p>
            )}
          </div>

          {mode === "modal" && typeof onClose === "function" && (
            <button className="survey-close" type="button" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        {/* ✅ 4축 점수 시각화 (만점 기준) */}
        <div className="resultBars">
          {Object.keys(AXIS_LABEL).map((k) => {
            const v = finalScores?.[k] ?? 0;

            const max = getAxisMax(k);
            const pct = toPercent(v, k);
            const ten = toTenScale(v, k);

            return (
              <div className="barRow" key={k}>
                <div className="barLabel">{AXIS_LABEL[k]}</div>

                <div className="barTrack">
                  <div className="barFill" style={{ width: `${pct}%` }} />
                </div>

                <div className="barValue">
                  {ten}/10
                  <span className="barSub"> ({v}/{max})</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="survey-actions">
          <button type="button" className="survey-btn ghost" onClick={onReset}>
            다시하기
          </button>

          <button
            type="button"
            className="survey-btn primary"
            onClick={handleSaveResult}
          >
            결과 저장
          </button>
        </div>

        <div className="resultHint">
          결과 저장을 누르면 마이페이지에서 언제든지 확인할 수 있습니다.
        </div>
      </div>
    </div>
  );
};

export default ResultPage;

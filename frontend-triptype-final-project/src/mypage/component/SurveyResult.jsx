import MyPageSectionTitle from "../common/component/MyPageSectionTitle";
import "../css/SurveyResult.css";
import "../css/MyPageCommon.css";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import api from "../../common/api/axiosInstance.js"; // ✅ 너희 api.js 경로에 맞춰서 조정

const AXES = [
  { key: "surveyRelaxScore", label: "휴양·힐링" },
  { key: "surveyCityScore", label: "도시·맛집" },
  { key: "surveyNatureScore", label: "자연·감성" },
  { key: "surveyActivityScore", label: "액티비티·체험" },
];

// ✅ 너 설문 만점 기준이 10점 환산이면 여기 MAX=10 유지
// DB 원점수(예: 14/13/12…)를 쓰는 구조면 MAX를 축별로 다르게 가져와야 함.
const MAX = 10;

function clamp(n) {
  const v = Number(n) || 0;
  return Math.max(0, Math.min(MAX, v));
}

function typeLabel(typeCode) {
  if (!typeCode) return "미정";
  // 필요하면 여기서 RELAX_CITY 같은 코드 → 한글 라벨로 매핑
  return typeCode;
}

function topTwoAxes({ r, c, n, a }) {
  const arr = [
    { key: "RELAX", label: "휴양·힐링", v: r },
    { key: "CITY", label: "도시·맛집", v: c },
    { key: "NATURE", label: "자연·감성", v: n },
    { key: "ACTIVITY", label: "액티비티·체험", v: a },
  ].sort((x, y) => y.v - x.v);

  return { top: arr[0], second: arr[1], all: arr };
}

// ✅ 성향(1~2위) 조합별 문구
function summaryByStyle({ r, c, n, a }) {
  const { top, second } = topTwoAxes({ r, c, n, a });

  if ((top?.v ?? 0) === 0) {
    return "설문 점수가 비어있습니다. 설문을 다시 진행해 주세요.";
  }

  // 동점 처리
  if ((top?.v ?? 0) === (second?.v ?? 0)) {
    return `${top.label}과(와) ${second.label} 성향이 비슷하게 높습니다. 두 가지 매력을 모두 살린 일정이 잘 어울립니다.`;
  }

  // 조합 키 만들기: TOP_SECOND
  const key = `${top.key}_${second.key}`;

  const map = {
    // 1) 휴양 1위
    RELAX_CITY: "휴양과 힐링을 가장 중요하게 생각하는 여행자입니다. 도시의 맛집과 분위기를 곁들이면 만족도가 더 높아집니다.",
    RELAX_NATURE: "휴양과 힐링을 중심으로 여행을 즐기며, 자연 속에서 여유를 느끼는 일정이 특히 잘 맞습니다.",
    RELAX_ACTIVITY: "편안한 휴식이 우선이지만, 가벼운 체험과 액티비티를 곁들이면 더 즐거운 여행이 됩니다.",

    // 2) 도시 1위
    CITY_RELAX: "도시의 맛집과 핫플을 즐기는 성향이 강합니다. 일정 사이에 휴식 시간을 적절히 넣으면 여행 밸런스가 좋아집니다.",
    CITY_NATURE: "도시의 즐길 거리와 맛집을 선호하면서도, 감성적인 자연 스팟을 함께 찾는 스타일입니다.",
    CITY_ACTIVITY: "도시 중심의 활동적인 여행을 선호합니다. 이동 동선이 효율적인 일정이 특히 잘 맞습니다.",

    // 3) 자연 1위
    NATURE_RELAX: "자연 속에서 감성을 충전하는 여행자입니다. 무리하지 않는 여유로운 일정이 특히 잘 어울립니다.",
    NATURE_CITY: "자연 풍경과 감성 스팟을 중시하면서도, 도시의 편의와 맛집도 함께 즐기는 스타일입니다.",
    NATURE_ACTIVITY: "자연을 즐기되 체험 요소도 놓치지 않는 성향입니다. 트레킹·체험형 코스가 잘 맞습니다.",

    // 4) 액티비티 1위
    ACTIVITY_CITY: "체험과 액티비티를 즐기는 성향이 강합니다. 도시의 즐길 거리까지 더하면 일정 만족도가 높아집니다.",
    ACTIVITY_NATURE: "활동적인 경험을 선호하며 자연 속에서 움직이는 코스가 특히 잘 맞습니다.",
    ACTIVITY_RELAX: "활동적인 일정이 중심이지만, 중간중간 회복할 휴식 시간을 확보하면 더 오래 즐길 수 있습니다.",
  };

  // 기본 문구(혹시 맵에 없을 때)
  const fallback = `${top.label} 성향이 가장 뚜렷합니다. ${second.label} 요소를 함께 담으면 만족도가 더 높아집니다.`;

  return map[key] || fallback;
}

function SurveyResult() {
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    const fetchMySurvey = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          setSurvey(null);
          return;
        }

        const res = await api.get("/api/survey/me");

        if (res?.data?.success === false) {
          toast.error(res?.data?.message || "설문 조회 실패");
          setSurvey(null);
          return;
        }

        setSurvey(res?.data?.exists ? (res?.data?.data || null) : null);
      } catch (e) {
        console.error(e);
        toast.error("설문 조회 실패");
        setSurvey(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMySurvey();
  }, []);

  const view = useMemo(() => {
    if (!survey) return null;

    const r = clamp(survey.surveyRelaxScore);
    const c = clamp(survey.surveyCityScore);
    const n = clamp(survey.surveyNatureScore);
    const a = clamp(survey.surveyActivityScore);

    return {
      type: typeLabel(survey.surveyResult),
      r,
      c,
      n,
      a,
      summary: summaryByStyle({ r, c, n, a }),
    };
  }, [survey]);

  if (loading) {
    return (
      <div className="mypage-page">
        <MyPageSectionTitle title="설문 결과" />
        <div className="mypage-card">
          <h3 className="mypage-card-title">나의 여행 성향</h3>
          <p className="mypage-muted">불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-page">
      <MyPageSectionTitle title="설문 결과" />

      <div className="mypage-card surveyCardV2">
        <div className="surveyHeader">
          <div>
            <h3 className="mypage-card-title">나의 여행 성향</h3>
            <p className="mypage-muted">
              {view ? "저장된 설문 결과입니다." : "아직 설문 결과가 없습니다. 설문을 먼저 완료해 주세요."}
            </p>
          </div>

          {view && <div className="typePill">{view.type}</div>}
        </div>

        {!view ? (
          <div className="surveyEmpty">
            <div className="survey-placeholder">
              <div className="chip">#여행취향</div>
              <div className="chip">#추천여행지</div>
              <div className="chip">#항공권추천</div>
            </div>
          </div>
        ) : (
          <>
            <div className="surveySummary">{view.summary}</div>

            <div className="axisGrid">
              {AXES.map((a) => {
                const v = clamp(survey[a.key]);
                const pct = Math.round((v / MAX) * 100);

                return (
                  <div className="axisRow" key={a.key}>
                    <div className="axisLabel">{a.label}</div>

                    <div className="axisBar">
                      <div className="axisFill" style={{ width: `${pct}%` }} />
                    </div>

                    <div className="axisValue">
                      <b>{v}</b>
                      <span className="axisMax">/ {MAX}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SurveyResult;

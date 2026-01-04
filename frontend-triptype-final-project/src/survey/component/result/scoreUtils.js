// src/survey/result/scoreUtils.js

export const AXIS_LABEL = {
  RELAX: "휴양 · 힐링",
  CITY: "도시 · 맛집",
  NATURE: "자연 · 감성",
  ACTIVITY: "액티비티 · 체험",
};

// ✅ 엑셀(설문 문항+점수표) 기준 축별 만점
export const AXIS_MAX = {
  RELAX: 14,
  CITY: 13,
  NATURE: 12,
  ACTIVITY: 12,
};

// “현재점수 / 만점” 표시용
export const getAxisMax = (axisKey) => AXIS_MAX[axisKey] ?? 1;

// 10점 만점 환산(원하면 UI에 같이 표기)
export const toTenScale = (value, axisKey) => {
  const max = getAxisMax(axisKey);
  const v = Number(value ?? 0);
  return Math.round((v / max) * 10);
};

// 막대 퍼센트 (만점 기준)
export const toPercent = (value, axisKey) => {
  const max = getAxisMax(axisKey);
  const v = Number(value ?? 0);
  return Math.round((v / max) * 100);
};

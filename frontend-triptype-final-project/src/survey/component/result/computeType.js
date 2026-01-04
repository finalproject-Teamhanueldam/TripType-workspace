// src/survey/result/computeType.js

const TYPE_META = {
  RELAX: {
    typeCode: "RELAX",
    title: "힐링형 여행자",
    desc: "여유와 휴식을 중시하는 힐링형 여행자",
  },
  CITY: {
    typeCode: "CITY",
    title: "도시탐험형 여행자",
    desc: "도시의 매력과 미식을 즐기는 여행자",
  },
  NATURE: {
    typeCode: "NATURE",
    title: "자연감성형 여행자",
    desc: "자연 풍경과 감성을 중시하는 여행자",
  },
  ACTIVITY: {
    typeCode: "ACTIVITY",
    title: "도전활동형 여행자",
    desc: "새로운 체험과 활동을 즐기는 여행자",
  },

  RELAX_CITY: {
    typeCode: "RELAX_CITY",
    title: "여유로운 도심형",
    desc: "도심에서도 여유를 놓치지 않는 여행자",
  },
  RELAX_NATURE: {
    typeCode: "RELAX_NATURE",
    title: "휴식 자연형",
    desc: "자연 속에서 휴식을 즐기는 여행자",
  },
  RELAX_ACTIVITY: {
    typeCode: "RELAX_ACTIVITY",
    title: "밸런스 체험형",
    desc: "휴식과 체험을 균형 있게 즐기는 여행자",
  },
  CITY_ACTIVITY: {
    typeCode: "CITY_ACTIVITY",
    title: "도시 액티브형",
    desc: "도시 탐방과 활동을 함께 즐기는 여행자",
  },
  CITY_NATURE: {
    typeCode: "CITY_NATURE",
    title: "도시+자연형",
    desc: "도시와 자연을 모두 즐기고 싶은 여행자",
  },
  NATURE_ACTIVITY: {
    typeCode: "NATURE_ACTIVITY",
    title: "자연 액티브형",
    desc: "자연 속에서 활동적인 경험을 즐기는 여행자",
  },

  MIXED: {
    typeCode: "MIXED",
    title: "균형형 여행자",
    desc: "상황에 따라 여행 스타일이 달라지는 균형형 여행자",
  },
};

// ✅ “전반적으로 비슷하면 MIXED” 판단 기준(필요하면 숫자만 조정)
// 현재: (최고점 - 최저점) <= 1 이면 MIXED
const MIXED_SPREAD = 1;

export const computeType = (scores) => {
  const axes = ["RELAX", "CITY", "NATURE", "ACTIVITY"];

  const list = axes.map((k) => [k, Number(scores?.[k] ?? 0)]);
  list.sort((a, b) => b[1] - a[1]);

  const top1 = list[0]; // [axis, score]
  const top2 = list[1];
  const min = list[list.length - 1][1];

  const diffAll = top1[1] - min;       // 최고 - 최저
  const diff12 = top1[1] - top2[1];    // 1위 - 2위

  // STEP5: 전반적으로 비슷하면 MIXED
  if (diffAll <= MIXED_SPREAD) {
    return TYPE_META.MIXED;
  }

  // STEP3: 1위-2위 >= 2 → 단일
  if (diff12 >= 2) {
    return TYPE_META[top1[0]];
  }

  // STEP4: 1위-2위 < 2 → 복합 (1위_2위)
  const a = top1[0];
  const b = top2[0];

  // 엑셀에 있는 복합 TYPE_CODE는 특정 조합명으로 고정되어 있으니 매핑 필요
  const key =
    a === "RELAX" && b === "CITY" ? "RELAX_CITY" :
    a === "RELAX" && b === "NATURE" ? "RELAX_NATURE" :
    a === "RELAX" && b === "ACTIVITY" ? "RELAX_ACTIVITY" :
    a === "CITY" && b === "ACTIVITY" ? "CITY_ACTIVITY" :
    a === "CITY" && b === "NATURE" ? "CITY_NATURE" :
    a === "NATURE" && b === "ACTIVITY" ? "NATURE_ACTIVITY" :
    // 정렬상 (b,a)로 들어올 가능성 대비
    b === "RELAX" && a === "CITY" ? "RELAX_CITY" :
    b === "RELAX" && a === "NATURE" ? "RELAX_NATURE" :
    b === "RELAX" && a === "ACTIVITY" ? "RELAX_ACTIVITY" :
    b === "CITY" && a === "ACTIVITY" ? "CITY_ACTIVITY" :
    b === "CITY" && a === "NATURE" ? "CITY_NATURE" :
    b === "NATURE" && a === "ACTIVITY" ? "NATURE_ACTIVITY" :
    "MIXED";

  return TYPE_META[key] || TYPE_META.MIXED;
};

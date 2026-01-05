// survey/question/questions.js
// 취향설문 문항(수정본.xlsx) 기반

export const QUESTIONS = [
  {
    id: 1,
    text: "여행에서 가장 중요한 것은?",
    options: [
      { id: 1, text: "쉬면서 재충전", score: { RELAX: 2, CITY: 0, NATURE: 0, ACTIVITY: 0 } },
      { id: 2, text: "도시 구경/맛집", score: { RELAX: 0, CITY: 2, NATURE: 0, ACTIVITY: 0 } },
      { id: 3, text: "자연 풍경/감성", score: { RELAX: 0, CITY: 0, NATURE: 2, ACTIVITY: 0 } },
      { id: 4, text: "새로운 체험/도전", score: { RELAX: 0, CITY: 0, NATURE: 0, ACTIVITY: 2 } },
    ],
  },
  {
    id: 2,
    text: "여행 일정은 어떻게 잡나요?",
    options: [
      { id: 1, text: "여유롭게 소수의 장소", score: { RELAX: 2, CITY: 0, NATURE: 1, ACTIVITY: 0 } },
      { id: 2, text: "효율적으로 핵심만", score: { RELAX: 0, CITY: 2, NATURE: 0, ACTIVITY: 1 } },
      { id: 3, text: "이동 많아도 상관없음", score: { RELAX: 0, CITY: 1, NATURE: 0, ACTIVITY: 2 } },
    ],
  },
  {
    id: 3,
    text: "더 끌리는 장소는?",
    options: [
      { id: 1, text: "조용한 휴양지", score: { RELAX: 2, CITY: 0, NATURE: 1, ACTIVITY: 0 } },
      { id: 2, text: "대도시 중심", score: { RELAX: 0, CITY: 2, NATURE: 0, ACTIVITY: 1 } },
      { id: 3, text: "산/바다/자연", score: { RELAX: 0, CITY: 0, NATURE: 2, ACTIVITY: 1 } },
    ],
  },
  {
    id: 4,
    text: "여행 중 활동 선호는?",
    options: [
      { id: 1, text: "휴식 위주", score: { RELAX: 2, CITY: 0, NATURE: 1, ACTIVITY: 0 } },
      { id: 2, text: "관광/쇼핑", score: { RELAX: 0, CITY: 2, NATURE: 0, ACTIVITY: 1 } },
      { id: 3, text: "액티비티/체험", score: { RELAX: 0, CITY: 0, NATURE: 0, ACTIVITY: 2 } },
    ],
  },
  {
    id: 5,
    text: "숙소에서의 시간은?",
    options: [
      { id: 1, text: "숙소가 여행의 핵심", score: { RELAX: 2, CITY: 0, NATURE: 1, ACTIVITY: 0 } },
      { id: 2, text: "잠만 자면 충분", score: { RELAX: 0, CITY: 1, NATURE: 0, ACTIVITY: 2 } },
      { id: 3, text: "주변 환경도 중요", score: { RELAX: 0, CITY: 0, NATURE: 2, ACTIVITY: 0 } },
    ],
  },
  {
    id: 6,
    text: "가장 기억에 남는 순간은?",
    options: [
      { id: 1, text: "편안함/여유", score: { RELAX: 2, CITY: 0, NATURE: 0, ACTIVITY: 0 } },
      { id: 2, text: "명소/핫플", score: { RELAX: 0, CITY: 2, NATURE: 0, ACTIVITY: 0 } },
      { id: 3, text: "자연 속 장면", score: { RELAX: 0, CITY: 0, NATURE: 2, ACTIVITY: 0 } },
      { id: 4, text: "직접 한 경험", score: { RELAX: 0, CITY: 0, NATURE: 0, ACTIVITY: 2 } },
    ],
  },
  {
    id: 7,
    text: "여행 사진을 돌아볼 때?",
    options: [
      { id: 1, text: "숙소/휴식", score: { RELAX: 2, CITY: 0, NATURE: 0, ACTIVITY: 0 } },
      { id: 2, text: "도시 거리/카페", score: { RELAX: 0, CITY: 2, NATURE: 0, ACTIVITY: 0 } },
      { id: 3, text: "풍경 사진", score: { RELAX: 0, CITY: 0, NATURE: 2, ACTIVITY: 0 } },
      { id: 4, text: "활동 장면", score: { RELAX: 0, CITY: 0, NATURE: 0, ACTIVITY: 2 } },
    ],
  },
];

export const AXES = ["RELAX", "CITY", "NATURE", "ACTIVITY"];
export const QUESTION_COUNT = QUESTIONS.length;

// src/features/recommend/data/destinations.js

// ✅ 리액트(dev:5173)에서 백엔드(static:8001) 이미지 불러오기
// const BACKEND_ORIGIN =
//   import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8001";

//const BASE = `${BACKEND_ORIGIN}/triptype/tripplace`;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BASE = `${API_BASE_URL}/tripplace`;

export const DESTINATIONS = [
  { id: 1, name: "발리", sub: "휴양 · 힐링", price: "₩512,000~", img: `${BASE}/vali.jfif`, iata: "DPS", axes: ["RELAX"] },
  { id: 2, name: "다낭", sub: "휴양 · 리조트", price: "₩299,000~", img: `${BASE}/danang.webp`, iata: "DAD", axes: ["RELAX"] },
  { id: 3, name: "세부", sub: "휴양 · 바다", price: "₩349,000~", img: `${BASE}/sebu.webp`, iata: "CEB", axes: ["RELAX"] },
  { id: 4, name: "푸껫", sub: "휴양 · 비치", price: "₩419,000~", img: `${BASE}/pucket.webp`, iata: "HKT", axes: ["RELAX"] },
  { id: 5, name: "괌", sub: "휴양 · 가족", price: "₩389,000~", img: `${BASE}/gwam.webp`, iata: "GUM", axes: ["RELAX"] },

  { id: 6, name: "도쿄", sub: "도시 · 미식", price: "₩289,000~", img: `${BASE}/tokyo.avif`, iata: "NRT", axes: ["CITY"] },
  { id: 7, name: "오사카", sub: "도시 · 먹방", price: "₩279,000~", img: `${BASE}/osakajyo.webp`, iata: "KIX", axes: ["CITY"] },
  { id: 8, name: "후쿠오카", sub: "도시 · 근교", price: "₩239,000~", img: `${BASE}/hukuoka.webp`, iata: "FUK", axes: ["CITY"] },
  { id: 9, name: "홍콩", sub: "도시 · 야경", price: "₩399,000~", img: `${BASE}/Hong_Kong.jpg`, iata: "HKG", axes: ["CITY"] },
  { id: 10, name: "파리", sub: "도시 · 문화", price: "₩921,000~", img: `${BASE}/paris.webp`, iata: "CDG", axes: ["CITY"] },

  { id: 11, name: "제주", sub: "자연 · 감성", price: "₩79,000~", img: `${BASE}/jeju.webp`, iata: "CJU", axes: ["NATURE"] },
  { id: 12, name: "삿포로", sub: "자연 · 설경", price: "₩420,000~", img: `${BASE}/saporo.webp`, iata: "CTS", axes: ["NATURE"] },
  { id: 13, name: "오클랜드", sub: "자연 · 풍경", price: "₩1,050,000~", img: `${BASE}/orcland.jpg`, iata: "AKL", axes: ["NATURE"] },
  { id: 14, name: "벤쿠버", sub: "자연 · 산책", price: "₩1,180,000~", img: `${BASE}/venkuver.jfif`, iata: "YVR", axes: ["NATURE"] },
  { id: 15, name: "치앙마이", sub: "자연 · 힐링", price: "₩429,000~", img: `${BASE}/chiangmai.jpg`, iata: "CNX", axes: ["NATURE"] },

  { id: 16, name: "싱가포르", sub: "체험 · 테마파크", price: "₩480,000~", img: `${BASE}/singarpor.avif`, iata: "SIN", axes: ["ACTIVITY"] },
  { id: 17, name: "두바이", sub: "체험 · 사막", price: "₩1,090,000~", img: `${BASE}/dubai.webp`, iata: "DXB", axes: ["ACTIVITY"] },
  { id: 18, name: "시드니", sub: "체험 · 액티비티", price: "₩980,000~", img: `${BASE}/sedney.webp`, iata: "SYD", axes: ["ACTIVITY"] },
  { id: 19, name: "로스앤젤레스", sub: "체험 · 엔터", price: "₩1,180,000~", img: `${BASE}/losandjelas.jfif`, iata: "LAX", axes: ["ACTIVITY"] },
  { id: 20, name: "방콕", sub: "체험 · 쇼핑", price: "₩412,000~", img: `${BASE}/bankock.jpg`, iata: "BKK", axes: ["ACTIVITY", "CITY", "RELAX"] },
];

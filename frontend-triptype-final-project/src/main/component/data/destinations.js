// src/features/recommend/data/destinations.js

export const DESTINATIONS = [
  // =========================================================
  // RELAX (휴양 · 힐링) 5
  // =========================================================
  {
    id: 1,
    name: "발리",
    sub: "휴양 · 힐링",
    price: "₩512,000~",
    img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop",
    iata: "DPS",
    axes: ["RELAX"],
  },
  {
    id: 2,
    name: "다낭",
    sub: "휴양 · 리조트",
    price: "₩299,000~",
    img: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1600&auto=format&fit=crop",
    iata: "DAD",
    axes: ["RELAX"],
  },
  {
    id: 3,
    name: "세부",
    sub: "휴양 · 바다",
    price: "₩349,000~",
    img: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1600&auto=format&fit=crop",
    iata: "CEB",
    axes: ["RELAX"],
  },
  {
    id: 4,
    name: "푸껫",
    sub: "휴양 · 비치",
    price: "₩419,000~",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
    iata: "HKT",
    axes: ["RELAX"],
  },
  {
    id: 5,
    name: "괌",
    sub: "휴양 · 가족",
    price: "₩389,000~",
    img: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1600&auto=format&fit=crop",
    iata: "GUM",
    axes: ["RELAX"],
  },

  // =========================================================
  // CITY (도시 · 미식) 5
  // =========================================================
  {
    id: 6,
    name: "도쿄",
    sub: "도시 · 미식",
    price: "₩289,000~",
    img: "https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1600&auto=format&fit=crop",
    iata: "NRT",
    axes: ["CITY"],
  },
  {
    id: 7,
    name: "오사카",
    sub: "도시 · 먹방",
    price: "₩279,000~",
    img: "https://images.unsplash.com/photo-1526481280695-3c687fd643ed?q=80&w=1600&auto=format&fit=crop",
    iata: "KIX",
    axes: ["CITY"],
  },
  {
    id: 8,
    name: "후쿠오카",
    sub: "도시 · 근교",
    price: "₩239,000~",
    img: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=1600&auto=format&fit=crop",
    iata: "FUK",
    axes: ["CITY"],
  },
  {
    id: 9,
    name: "홍콩",
    sub: "도시 · 야경",
    price: "₩399,000~",
    img: "https://images.unsplash.com/photo-1506973035872-a4f23ef53f3b?q=80&w=1600&auto=format&fit=crop",
    iata: "HKG",
    axes: ["CITY"],
  },
  {
    id: 10,
    name: "파리",
    sub: "도시 · 문화",
    price: "₩921,000~",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop",
    iata: "CDG",
    axes: ["CITY"],
  },

  // =========================================================
  // NATURE (자연 · 감성) 5
  // =========================================================
  {
    id: 11,
    name: "제주",
    sub: "자연 · 감성",
    price: "₩79,000~",
    img: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1600&auto=format&fit=crop",
    iata: "CJU",
    axes: ["NATURE"],
  },
  {
    id: 12,
    name: "삿포로",
    sub: "자연 · 설경",
    price: "₩420,000~",
    img: "https://images.unsplash.com/photo-1548095115-45697e8a18a8?q=80&w=1600&auto=format&fit=crop",
    iata: "CTS",
    axes: ["NATURE"],
  },
  {
    id: 13,
    name: "오클랜드",
    sub: "자연 · 풍경",
    price: "₩1,050,000~",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop",
    iata: "AKL",
    axes: ["NATURE"],
  },
  {
    id: 14,
    name: "벤쿠버",
    sub: "자연 · 산책",
    price: "₩1,180,000~",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop",
    iata: "YVR",
    axes: ["NATURE"],
  },
  {
    id: 15,
    name: "치앙마이",
    sub: "자연 · 힐링",
    price: "₩429,000~",
    img: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1600&auto=format&fit=crop",
    iata: "CNX",
    axes: ["NATURE"],
  },

  // =========================================================
  // ACTIVITY (액티비티 · 체험) 5
  // =========================================================
  {
    id: 16,
    name: "싱가포르",
    sub: "체험 · 테마파크",
    price: "₩480,000~",
    img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1600&auto=format&fit=crop",
    iata: "SIN",
    axes: ["ACTIVITY"],
  },
  {
    id: 17,
    name: "두바이",
    sub: "체험 · 사막",
    price: "₩1,090,000~",
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop",
    iata: "DXB",
    axes: ["ACTIVITY"],
  },
  {
    id: 18,
    name: "시드니",
    sub: "체험 · 액티비티",
    price: "₩980,000~",
    img: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    iata: "SYD",
    axes: ["ACTIVITY"],
  },
  {
    id: 19,
    name: "로스앤젤레스",
    sub: "체험 · 엔터",
    price: "₩1,180,000~",
    img: "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?q=80&w=1600&auto=format&fit=crop",
    iata: "LAX",
    axes: ["ACTIVITY"],
  },
  {
    id: 20,
    name: "방콕",
    sub: "체험 · 쇼핑",
    price: "₩412,000~",
    img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1600&auto=format&fit=crop",
    iata: "BKK",
    axes: ["ACTIVITY", "CITY", "RELAX"], // ✅ 복합형 적용 가능
  },
];

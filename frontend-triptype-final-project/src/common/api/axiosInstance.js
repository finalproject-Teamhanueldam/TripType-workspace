import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

// ✅ 추가: 모든 요청에 토큰 자동 첨부
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url || "";
    const pathname = window.location.pathname;

    if (status === 401) {
      // ✅ 핵심: "비로그인(토큰 없음)"이면 401 떠도 강제 로그인 이동 금지
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return Promise.reject(err);
      }

      // ✅ 로그인 페이지(회원 페이지)에서는 401로 인한 강제 이동을 막아 루프 방지
      const isMemberPage = pathname.startsWith("/member");

      // ✅ 로그인 필수 API에 대해서만 로그인 페이지로 강제 이동
      const needLogin =
        url.includes("/api/mypage") ||
        url.includes("/triptype/api/mypage") ||
        url.includes("/api/survey") ||
        url.includes("/triptype/api/survey") ||
        url.includes("/airline/review") ||
        url.includes("/triptype/airline/review") ||
        url.includes("/triptype/admin") ||
        url.includes("/admin");

      if (needLogin) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("memberName");
        localStorage.removeItem("role");
        localStorage.removeItem("memberId");

        if (!isMemberPage) {
          window.location.href = "/member?tab=login";
        }
      }
    }

    return Promise.reject(err);
  }
);

export default api;

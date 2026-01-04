import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      // 강제 로그아웃
      localStorage.removeItem("accessToken");
      localStorage.removeItem("memberName");
      localStorage.removeItem("role");
      localStorage.removeItem("memberId");
      // 로그인 페이지 이동
      window.location.href = "/member?tab=login";
    }
    return Promise.reject(err);
  }
);

export default api;

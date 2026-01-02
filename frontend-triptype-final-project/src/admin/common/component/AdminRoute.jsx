import { Navigate } from "react-router-dom";

// children: 보호할 페이지 컴포넌트
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  // 1. 로그인 안 됨 → 로그인 페이지로
  if (!token) return <Navigate to="/member?tab=login" replace />;

  // 2. 관리자 권한 없음 → 메인페이지로
  if (role !== "ADMIN") return <Navigate to="/" replace />;

  // 3. 관리자면 접근 허용
  return children;
};

export default AdminRoute;
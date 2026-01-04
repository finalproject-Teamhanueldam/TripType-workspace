import "../css/AdminHeader.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AdminHeader = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const today = new Date().toISOString().slice(0, 10);
  const [adminName, setAdminName] = useState("");

  /* =========================
     관리자 이름 로딩
  ========================= */
  useEffect(() => {
    const name = localStorage.getItem("memberName");
    setAdminName(name || "관리자");
  }, []);

  /* =========================
     로그아웃
  ========================= */
  const handleLogout = () => {
    // 🔥 인증/권한 정보만 제거
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("memberName");
    localStorage.removeItem("memberId");
    localStorage.removeItem("refreshToken"); // 있으면

    // ❗ savedMemberId 는 유지 (아이디 저장 UX)

    // 🔥 관리자 접근 차단 + 히스토리 제거
    navigate("/member?tab=login", { replace: true });
  };

  return (
    <div className="admin-header">
      {/* 좌측: 메뉴 버튼 */}
      <button className="menu-btn" onClick={onMenuClick}>
        ☰
      </button>

      <div className="admin-today-date">{today}</div>

      <div className="admin-header-right">
        <span className="admin-name">
          {adminName} 님
        </span>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;

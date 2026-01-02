import "../../css/MyPageHeader.css";

const MyPageHeader = ({ onMenuClick, memberName = "회원" }) => {
  const today = new Date().toISOString().slice(0, 10);

  const handleLogout = () => {
    // 너희 프로젝트 로그인 방식(localStorage) 기준
    localStorage.removeItem("accessToken");
    localStorage.removeItem("memberName");
    localStorage.removeItem("role");
    window.location.href = "/"; // 홈으로
  };

  return (
    <div className="mypage-header">
      <button className="mypage-menu-btn" onClick={onMenuClick}>
        ☰
      </button>

      <div className="mypage-today-date">{today}</div>

      <div className="mypage-header-right">
        <span className="mypage-name">{memberName} 님</span>
        <button className="mypage-logout-btn" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default MyPageHeader;
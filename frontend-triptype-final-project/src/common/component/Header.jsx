import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/Header.css";
import { AiFillHeart } from "react-icons/ai";
import { toast } from "react-toastify";

const Header = () => {

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(false);
  const [memberName, setMemberName] = useState("");

  useEffect(() => {
    const syncLogin = () => {
      const token = localStorage.getItem("accessToken");
      const name = localStorage.getItem("memberName");

      setIsLogin(!!token);
      setMemberName(name || "");
    };

    syncLogin(); // 최초 실행
    // 로그인 / 로그아웃 이벤트 감지
    window.addEventListener("loginChanged", syncLogin);

    return () => {
      window.removeEventListener("loginChanged", syncLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("memberName");
    localStorage.removeItem("role");
    localStorage.removeItem("memberId");

    setIsLogin(false);
    setMemberName("");

    // ✅ 핵심: RecommendSection도 즉시 블러로 전환되도록 동일 이벤트를 함께 발사
    // - Header는 기존 loginChanged를 유지(헤더 갱신용)
    // - RecommendSection은 auth-changed를 듣도록 수정한 상태 기준
    window.dispatchEvent(new Event("loginChanged"));
    window.dispatchEvent(new Event("auth-changed"));

    navigate("/"); // 메인페이지로 이동
  };

  // ✅ 취향설문 클릭 가드: 비로그인이면 로그인 페이지로 보내고 알림
  // - Header는 "분기" 하지 않고, GatePage(/survey)로만 진입시키는 역할만 한다.
  const handleSurveyClick = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("로그인 후 이용 가능합니다.");
      navigate("/member?tab=login");
      return;
    }

    navigate("/survey"); // ✅ GatePage 라우트
  };

  return (
    <header className="header">
      <div className="header-inner">
        {/* 왼쪽 로고 */}
        <div className="header-left">
          <Link to="/">
            <img
              src={`${API_BASE_URL}/logo_image/TripType_logo.png`}
              alt="TripType Logo"
            />
          </Link>
        </div>

        {/* 오른쪽 아이콘 / 로그인 */}
        <div className="header-right">
          <ul>
            {/* 도움 추가 (12.16 김동윤) */}
            <li>
              <Link to="/faq">도움</Link>
            </li>

            {/* ✅ 취향설문: 로그인 가드 적용 (Link 대신 span으로 깔끔하게 처리) */}
            <li>
              <span
                className="header-link"
                role="link"
                tabIndex={0}
                onClick={handleSurveyClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSurveyClick(e);
                }}
                style={{ cursor: "pointer" }}
              >
                취향설문
              </span>
            </li>

            <li>
              <Link to="/notice">공지사항</Link>
            </li>
          </ul>

          <Link className="heart-icon" to="/myPage/wishlist">
            <AiFillHeart className="heart-icon-svg"/>
          </Link>

          {/* 로그인, 회원가입 버튼 링크 추가 12.16(김동윤) */}
          {/* +추가 수정 2025-12-30(최경환) 비로그인 로그인 케이스 분류 */}
          {!isLogin ? (
            <>
              <Link to="/member?tab=login" className="login-btn">
                로그인
              </Link>
              <Link to="/member?tab=join" className="login-btn">
                회원가입
              </Link>
            </>
          ) : (
            <>
              <span
                className="login-btn"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const role = localStorage.getItem("role");
                  if (role === "ADMIN") {
                    navigate("/admin/statistics");
                  } else {
                    navigate("/mypage");
                  }
                }}
              >
                {memberName ? `${memberName}님` : "로그인됨"}
              </span>

              <span
                className="login-btn"
                onClick={handleLogout}
                style={{ cursor: "pointer" }}
              >
                로그아웃
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

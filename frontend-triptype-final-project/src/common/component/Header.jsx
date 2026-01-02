import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/Header.css";
import { AiFillHeart } from "react-icons/ai";
const Header = () => {

    // 실행할 구문
    // 로그인 상태 인 경우 헤더 상태 변경(2025-12-30 최경환)
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(false);
    const [memberName, setMemberName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const name = localStorage.getItem("memberName");
        setIsLogin(!!token);
        setMemberName(name || "");
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("memberName");
        localStorage.removeItem("role");
        localStorage.removeItem("memberId");

        setIsLogin(false);
        setMemberName("");

        window.dispatchEvent(new Event("loginChanged"));
        navigate("/"); // 메인페이지로 이동
    };

    // return 구문
    return (
        <header className="header">
            <div className="header-inner">

                {/* 왼쪽 로고 */}
                <div className="header-left">
                    <Link to="/">
                        <img 
                            src="http://localhost:8001/triptype/logo_image/TripType_logo.png"
                            alt="TripType Logo"
                        />
                    </Link>
                </div>

                {/* 오른쪽 아이콘 / 로그인 */}
                <div className="header-right">
                    <ul>
                        {/* 도움 추가 (12.16 김동윤) */}
                        <li><Link to="/faq">도움</Link></li>
                        <li><Link to="/quiz">취향설문</Link></li>
                        <li><Link to="/notice">공지사항</Link></li>
                    </ul>
                    <Link className="heart-icon">
                        <AiFillHeart className="heart-icon-svg" />
                    </Link>
                    {/* 로그인, 회원가입 버튼 링크 추가 12.16(김동윤) */}
                    {/* <Link to="/login" className="login-btn">로그인</Link> */}
                    {/* +추가 수정 2025-12-30(최경환) 비로그인 로그인 케이스 분류 */}
                    {/* 일반 사용자일 경우와 관리자일 경우 로그인버튼 누르면 마이페이지, 관리자페이지로 가게끔 해야함 */}
                    {!isLogin ? (
                        <>
                            <Link to="/member?tab=login" className="login-btn">로그인</Link>
                            <Link to="/member?tab=join" className="login-btn">회원가입</Link>
                        </>
                    ) : (
                        <>
                            {/* 김동윤 관리자권한분기 추가 */}
                            {/* <span className="login-btn" style={{ cursor: "pointer" }} onClick={() => navigate("/mypage")}>
                                {memberName ? `${memberName}님` : "로그인됨"}
                            </span> */}
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
                            <span className="login-btn" onClick={handleLogout} style={{ cursor: "pointer" }}>
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
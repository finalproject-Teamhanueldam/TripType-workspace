import { Link } from "react-router-dom";
import "../css/Header.css";
import { AiFillHeart } from "react-icons/ai";
const Header = () => {

    // 실행할 구문

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
                    <Link to="/member?tab=login" className="login-btn">로그인</Link>
                    <Link to="/member?tab=join" className="login-btn">회원가입</Link>
                </div>

            </div>
        </header>

    );

};

export default Header;
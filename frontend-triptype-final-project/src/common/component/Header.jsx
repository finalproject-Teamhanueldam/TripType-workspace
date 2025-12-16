import { Link } from "react-router-dom";
import "../style/Header.css";
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
                        <li><Link to="/quiz">취향설문</Link></li>
                        <li><Link to="/notice">공지사항</Link></li>
                    </ul>
                    <Link className="heart-icon">
                        <AiFillHeart className="heart-icon-svg" />
                    </Link>
                    {/* 로그인 링크 수정(최경환), 추후 회원가입 버튼 추가시 수정 필요 */}
                    <Link to="/member" className="login-btn">로그인</Link>
                </div>

            </div>
        </header>

    );

};

export default Header;
// src/main/component/layout/Footer.jsx
import axios from "axios";
import "../css/Footer.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {

  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* 상단 영역 */}
        <div className="footer-top">

          {/* 로고 & 설명 */}
          <div className="footer-brand">
            <h2 className="footer-logo">TripType</h2>
            <p className="footer-desc">
              취향 기반 맞춤 여행 추천 & 항공권 가격 비교 서비스
            </p>
          </div>

          {/* 메뉴 */}
          <div className="footer-menu">
            <div className="footer-col">
              <h4>서비스</h4>
              <ul>
                <li onClick={() => {navigate("/");}}>항공권 검색</li>
                <li onClick={() => {navigate("/survey");}}>취향 설문 추천</li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>고객지원</h4>
              <ul>
                <li onClick={() => {navigate("/notice");}}>공지사항</li>
                <li onClick={() => {navigate("/faq");}}>자주 묻는 질문</li>
              
              </ul>
            </div>
          </div>
        </div>

        {/* 하단 영역 */}
        <div className="footer-bottom">
          <p>© 2025 TripType. All rights reserved.</p>

          {/* 🔧 개발자용 수동 트리거 버튼
          <button
            className="footer-dev-btn"
            onClick={handleCollectFlight}
            title="개발자용 항공권 수집 트리거"
          >
            API COLLECT
          </button> */}
        </div>

      </div>
    </footer>
  );
};

export default Footer;

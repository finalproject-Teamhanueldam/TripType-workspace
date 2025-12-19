// src/main/component/layout/Footer.jsx
import axios from "axios";
import "../css/Footer.css";

const Footer = () => {

  /* 🔧 개발용: 항공권 가격 수집 트리거 */
  const handleCollectFlight = async () => {
    try {
      const res = await axios.post("/api/admin/flight-collect");
      alert("항공권 가격 수집 완료");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("항공권 수집 실패 (콘솔 확인)");
    }
  };

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
                <li>항공권 검색</li>
                <li>가격 추적</li>
                <li>취향 설문 추천</li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>프로젝트</h4>
              <ul>
                <li>서비스 소개</li>
                <li>기능 안내</li>
                <li>개발 배경</li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>고객지원</h4>
              <ul>
                <li>공지사항</li>
                <li>자주 묻는 질문</li>
                <li>문의하기</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 하단 영역 */}
        <div className="footer-bottom">
          <p>© 2025 TripType. All rights reserved.</p>

          {/* 🔧 개발자용 수동 트리거 버튼 */}
          <button
            className="footer-dev-btn"
            onClick={handleCollectFlight}
            title="개발자용 항공권 수집 트리거"
          >
            API COLLECT
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import LoginTab from "./LoginTab";
import JoinTab from "./JoinTab";
import FindTab from "./FindTab";
import "../css/AuthContainer.css";

// 로고 경로: src/images/logo.png 라고 가정
import logo from "../../../images/logo.png";

function AuthContainer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("login");

  // URL 쿼리(tab) → 상태 동기화
  useEffect(() => {
    const tab = searchParams.get("tab");

    if (tab === "login" || tab === "join" || tab === "find") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const renderTab = () => {
    switch (activeTab) {
      case "login": return <LoginTab />;
      case "join": return <JoinTab />;
      case "find": return <FindTab />;
      default: return <LoginTab />;
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <img src={logo} alt="TripType" className="auth-logo" />
          <div className="auth-title">트립타임</div>
          <div className="auth-subtitle">실시간 항공권 비교 · 맞춤 추천</div>
        </div>

        <div className="auth-tab-header">
            <button
                className={activeTab === "login" ? "active" : ""}
                onClick={() => navigate("/member?tab=login")}>
                로그인
            </button>

            <button
                className={activeTab === "join" ? "active" : ""}
                onClick={() => navigate("/member?tab=join")}>
                회원가입
            </button>

            <button
                className={activeTab === "find" ? "active" : ""}
                onClick={() => navigate("/member?tab=find")}>
                계정 찾기
            </button>
        </div>

        <div className="auth-tab-content">{renderTab()}</div>
      </div>
    </div>
  );
}

export default AuthContainer;

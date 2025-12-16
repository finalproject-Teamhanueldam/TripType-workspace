import { useState } from "react";
import LoginTab from "./LoginTab";
import JoinTab from "./JoinTab";
import FindTab from "./FindTab";
import "../css/AuthContainer.css";

function AuthContainer() {
  const [activeTab, setActiveTab] = useState("login");

  const renderTab = () => {
    switch (activeTab) {
      case "login":
        return <LoginTab />;
      case "join":
        return <JoinTab />;
      case "find":
        return <FindTab />;
      default:
        return <LoginTab />;
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-tab-header">
        <button
          className={activeTab === "login" ? "active" : ""}
          onClick={() => setActiveTab("login")}
        >
          로그인
        </button>
        <button
          className={activeTab === "join" ? "active" : ""}
          onClick={() => setActiveTab("join")}
        >
          회원가입
        </button>
        <button
          className={activeTab === "find" ? "active" : ""}
          onClick={() => setActiveTab("find")}
        >
          아이디 / 비밀번호 찾기
        </button>
      </div>

      <div className="auth-tab-content">
        {renderTab()}
      </div>
    </div>
  );
}

export default AuthContainer;
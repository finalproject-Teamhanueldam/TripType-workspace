import { useState } from "react";
import FindIdTab from "./find/FindIdTab"; // ✅ 경로 확인
import FindPasswordTab from "./find/FindPasswordTab"; // ✅ 경로 확인
import "../css/FindTab.css"; // ✅ 경로 확인 (한 단계 위 css 폴더)
import "react-datepicker/dist/react-datepicker.css";

function FindTab() {
  const [activeSubTab, setActiveSubTab] = useState("id");

  const renderSubTab = () => {
    if (activeSubTab === "id") return <FindIdTab />;
    return <FindPasswordTab />;
  };

  return (
    <div className="find-tab">
      <div className="find-sub-tabs">
        <button
          className={activeSubTab === "id" ? "active" : ""}
          onClick={() => setActiveSubTab("id")}
        >
          아이디 찾기
        </button>

        <button
          className={activeSubTab === "pw" ? "active" : ""}
          onClick={() => setActiveSubTab("pw")}
        >
          비밀번호 찾기
        </button>
      </div>

      <div className="find-content">
        {renderSubTab()}
      </div>
    </div>
  );
}

export default FindTab;
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import MyPageHeader from "../common/component/MyPageHeader";
import MyPageSidebar from "../common/component/MyPageSidebar";
import "../css/MyPageLayout.css";
import "../css/MyPageCommon.css";

const MyPageLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [memberName, setMemberName] = useState("회원");

  useEffect(() => {
    const name = localStorage.getItem("memberName");
    if (name) setMemberName(name);
  }, []);

  return (
    <>
      <MyPageHeader onMenuClick={() => setIsSidebarOpen(true)} memberName={memberName} />

      <div className="mypage-wrap">
        <div className="mypage-layout">
          <MyPageSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          <div className="mypage-content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyPageLayout;
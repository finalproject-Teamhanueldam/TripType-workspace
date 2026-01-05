import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../common/api/axiosInstance";

import MyPageHeader from "../common/component/MyPageHeader";
import MyPageSidebar from "../common/component/MyPageSidebar";
import "../css/MyPageLayout.css";
import "../css/MyPageCommon.css";

const MyPageLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/api/mypage/profile")
      .then(res => setProfile(res.data))
      .catch(err => console.error("마이페이지 프로필 로드 실패", err));
  }, []);

  return (
    <>
      <MyPageHeader onMenuClick={() => setIsSidebarOpen(true)} memberName={profile?.memberName || "회원"} />

      <div className="mypage-wrap">
        <div className="mypage-layout">
          <MyPageSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          <div className="mypage-content">
            <Outlet context={{ profile, setProfile }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyPageLayout;
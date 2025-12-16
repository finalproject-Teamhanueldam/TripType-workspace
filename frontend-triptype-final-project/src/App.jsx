import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

import Header from "./common/component/Header";
import HeroSection from "./main/component/HeroSection";
import Home from "./main/component/Home";

import AdminHeader from "./admin/common/component/AdminHeader";
import AuthSidebar from "./admin/common/component/AuthSidebar";

import AuthStatisticsComponent from "./admin/statistics/component/AuthStatisticsComponent";
import AirlineTicketComponent from "./admin/airlineticket/componnent/AirlineTicketComponent";

function App() {
  const location = useLocation();
  const showHero = location.pathname === "/";

  const isAdminPage = location.pathname.startsWith("/admin")

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>  

      {/* 관리자 페이지 일 경우 관리자 페이지용 헤더와 사이드 바, 메인 내용을 표시*/}
      {isAdminPage ? (
        <div>
          <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
        
          <div className="admin-layout">
          
            < AuthSidebar isOpen={isSidebarOpen}
                          onClose={() => setIsSidebarOpen(false)}/>

            <div className="admin-content">

              <Routes>
                <Route path="/admin/statistics" element={<AuthStatisticsComponent />} />
                <Route path="/admin/airlineticket" element={<AirlineTicketComponent />} />    
              </Routes>

            </div>
          </div>
        </div>)
        :  <Header />}

      {/* 메인 홈일 때만 HeroSection 표시 */}
      {showHero && <HeroSection />}

      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={<Home />} />

    
      </Routes>
    </div>
  );
}

export default App;

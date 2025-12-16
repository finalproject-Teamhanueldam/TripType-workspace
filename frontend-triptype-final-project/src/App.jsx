import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./common/component/Header";
import HeroSection from "./main/component/HeroSection";
import Home from "./main/component/Home";

import AuthStatisticsComponent from "./admin/statistics/component/AuthStatisticsComponent";
import AirlineTicketComponent from "./admin/airlineticket/componnent/AirlineTicketComponent";

function App() {
  const location = useLocation();
  const showHero = location.pathname === "/";

  return (
    <div>
      <Header />

      {/* 메인 홈일 때만 HeroSection 표시 */}
      {showHero && <HeroSection />}

      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={<Home />} />

        {/* 관리자 페이지 */}
        <Route path="/admin/statistics" element={<AuthStatisticsComponent />} />
        <Route path="/admin/airlineticket" element={<AirlineTicketComponent />} />
      </Routes>
    </div>
  );
}

export default App;

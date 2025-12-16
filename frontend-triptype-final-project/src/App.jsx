import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./common/component/header";
import HeroSection from "./main/component/HeroSection";
import Home from "./main/component/Home";

import AuthStatisticsComponent from "./admin/statistics/component/AuthStatisticsComponent";
import AirlineTicketComponent from "./admin/airlineticket/componnent/AirlineTicketComponent";

import AirlineDetailComponent from "./Airline/AirlineDetail/components/AirlineDetailComponent"
import TravelAlertComponent from "./TravelAlert/components/TravelAlertComponent";

function App() {
  const location = useLocation();
  const showHero = location.pathname === "/";

  // 추가: Header 숨길 경로 (최경환)
  const hideHeaderPaths = [
    "/member/login",
    "/member/join",
    "/member/find",
    "/admin"
  ];

  const hideHeader = hideHeaderPaths.some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <div>
      {/* 수정 : admin and member 관련 페이지 헤더 예외 처리 (최경환)*/}
      {!hideHeader && <Header />}

      {/* 메인 홈일 때만 HeroSection 표시 */}
      {showHero && <HeroSection />}

      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={<Home />} />

        {/* 관리자 페이지 */}
        <Route path="/admin/statistics" element={<AuthStatisticsComponent />} />
        <Route path="/admin/airlineticket" element={<AirlineTicketComponent />} />

        {/* 항공권 상세 페이지 */}
        <Route path="/airline/detail/:airlineNo" element={<AirlineDetailComponent/>}></Route>

        {/* 여행 경보 페이지 */}
        <Route path="/airline/travelAlert" element={<TravelAlertComponent/>}></Route>

      </Routes>
    </div>
  );
}

export default App;

import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";

// H 대문자 수정 (12.16 김동윤)
import Header from "./common/component/Header";

import HeroSection from "./main/component/HeroSection";
import Home from "./main/component/Home";

import AuthStatisticsComponent from "./admin/statistics/component/AuthStatisticsComponent";
import AirlineTicketComponent from "./admin/airlineticket/componnent/AirlineTicketComponent";

import AirlineDetailComponent from "./Airline/AirlineDetail/components/AirlineDetailComponent"
import TravelAlertComponent from "./TravelAlert/components/TravelAlertComponent";

// 코드 병합 (12.16 김동윤)
import AuthContainer from "./member/auth/component/AuthContainer";
// 공지사항 수정 (12.16 김동윤)
import UserNoticeList from "./notice/component/UserNoticeList";
import UserNoticeDetail from "./notice/component/UserNoticeDetail";
import AdminNoticeList from "./admin/notice/component/AdminNoticeList";
import AdminNoticeForm from "./admin/notice/component/AdminNoticeForm";



function App() {
  const location = useLocation();
  const showHero = location.pathname === "/";

  // 추가: Header 숨길 경로 (최경환)
  const hideHeaderPaths = [
    "/member",
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

        {/* 로그인 페이지(최경환) */}
        <Route path="/member" element={<AuthContainer />} />

        {/* 관리자 페이지 */}
        <Route path="/admin/statistics" element={<AuthStatisticsComponent />} />
        <Route path="/admin/airlineticket" element={<AirlineTicketComponent />} />

        {/* 관리자 공지 (12.16 김동윤)*/}
        <Route path="/admin/notice" element={<AdminNoticeList />} />
        <Route path="/admin/notice/write" element={<AdminNoticeForm />} />

        {/* 사용자 공지 (12.16 김동윤)*/}
        <Route path="/notice" element={<UserNoticeList />} />
        <Route path="/notice/:noticeId" element={<UserNoticeDetail />} />

        {/* 항공권 상세 페이지 */}
        <Route path="/airline/detail/:airlineNo" element={<AirlineDetailComponent/>}></Route>

        {/* 여행 경보 페이지 */}
        <Route path="/airline/travelAlert" element={<TravelAlertComponent/>}></Route>

      </Routes>
    </div>
  );
}

export default App;

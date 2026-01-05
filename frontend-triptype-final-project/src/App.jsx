import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";

// Toastify 추가
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// H 대문자 수정 (12.16 김동윤)
import Header from "./common/component/Header";
import Footer from "./common/component/Footer";

import HeroSection from "./main/component/HeroSection";
import Home from "./main/component/Home";

// 관리자 가드 (사용자/관리자 분기처리)
import AdminRoute from "./admin/common/component/AdminRoute";

// 관리자 페이지 공통 레이아웃(헤더, 사이드바)
import AdminLayout from "./admin/common/component/AdminLayout";

// 괸리자 통계, 항공권 관리, 항공사 리뷰 페이지
import AuthStatisticsComponent from "./admin/statistics/component/AuthStatisticsComponent";
import FlightComponent from "./admin/flight/componnent/FlightComponent";
import AdminAirlineReviewListComponent from "./admin/adminreview/component/AdminReviewListComponent";

// 관리자 회원 관리 페이지
import AdminMemberList from "./admin/member/component/AdminMemberList";
import AdminMemberDetail from "./admin/member/component/AdminMemberDetail";

// 여행 목록, 상세, 경보 페이지
import AirlineListComponent from "./Airline/ArlineList/components/AirlineListComponent";
import PriceComponent from "./Airline/Price/components/PriceComponent";
import AirlineDetailComponent from "./Airline/AirlineDetail/components/AirlineDetailComponent"
import TravelAlertComponent from "./TravelAlert/components/TravelAlertComponent";

// 코드 병합 (12.16 김동윤)
import AuthContainer from "./member/auth/component/AuthContainer";
// 공지사항 수정 (12.16 김동윤)
import UserNoticeList from "./notice/component/UserNoticeList";
import UserNoticeDetail from "./notice/component/UserNoticeDetail";
import AdminNoticeList from "./admin/notice/component/AdminNoticeList";
import AdminNoticeForm from "./admin/notice/component/AdminNoticeForm";
// import AdminNoticeCommentList from "./admin/notice/component/AdminNoticeCommentList";
import AdminNoticeDetail from "./admin/notice/component/AdminNoticeDetail";

// 사용자 FAQ 추가 (12.16 김동윤)
import UserFaqPage from "./faq/component/UserFaqPage";

// 카카오톡 상담 버튼 추가(최경환)
import KakaoChatButton from "./common/component/KakaoChatButton";

// 계정 잠금 해제 페이지 추가(최경환)
import UnlockTab from "./member/auth/component/UnlockTab";

// 마이페이지 페이지 추가(최경환)
import MyPageLayout from "./mypage/component/MyPageLayout";
import Profile from "./mypage/component/Profile";
import PasswordChange from "./mypage/component/PasswordChange";
import SurveyResult from "./mypage/component/SurveyResult";
import Wishlist from "./mypage/component/Wishlist";
import SearchHistory from "./mypage/component/SearchHistory";
import Withdraw from "./mypage/component/Withdraw";

// 프론트 라우터 가드 추가(최경환)
import PrivateRoute from "./common/route/PrivateRoute";

// 취향 설문 페이지 추가(지영재)
import SurveyShell from "./survey/component/common/SurveyShell";

// ✅ GatePage
import GatePage from "./survey/component/page/GatePage";

// ✅ Question / Result 페이지(설문 라우팅에 필요)
import QuestionPage from "./survey/component/page/QuestionPage";
import ResultPage from "./survey/component/page/ResultPage";

import OAuthRedirect from "./pages/OAuthRedirect";

function App() {
  const location = useLocation();
  const isMainPage = location.pathname === "/";
  console.log("현재 경로:", location.pathname);

  // 로그인 페이지, 추가: Header 숨길 경로 (최경환)
  const hideHeaderPaths = [
    "/member",
    "/admin",
    "/mypage"
  ];

  const hideHeader = hideHeaderPaths.some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <div>

      {/* 🔥 Toastify는 App 최상단에 단 1번 */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        draggable={false}
      />

      {/* 수정 : admin and member 관련 페이지 헤더 예외 처리 (최경환)*/}
      {!hideHeader && <Header />}

      {/* 메인 홈일 때만 HeroSection 표시 */}
      {isMainPage && <HeroSection />}

      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={<Home />} />

        {/* 로그인 페이지(최경환) */}
        <Route path="/member" element={<AuthContainer />} />

        {/* 계정 잠금 해제 페이지(12.31 최경환) */}
        <Route path="/member/unlock" element={<UnlockTab />} />

        {/* 사용자 공지 (12.16 김동윤)*/}
        <Route path="/notice" element={<UserNoticeList />} />
        <Route path="/notice/:noticeId" element={<UserNoticeDetail />} />

        {/* 사용자 FAQ (12.16 김동윤) */}
        <Route path="/faq" element={<UserFaqPage />} />

        {/* 항공권 목록 페이지 */}
        <Route path="/airline/list" element={<AirlineListComponent />} />
        <Route path="/airline/list/price" element={<PriceComponent />} />

        {/* 항공권 상세 페이지 */}
        <Route path="/airline/detail/:airlineNo" element={<AirlineDetailComponent />}></Route>

        {/* 여행 경보 페이지 */}
        <Route path="/airline/travelAlert" element={<TravelAlertComponent />}></Route>

        {/* 권한 분기 (1-2 김동윤) */}
        {/* 관리자 페이지 공통 Route (12-16 선종범)*/}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="statistics" element={<AuthStatisticsComponent />} />
          <Route path="flight" element={<FlightComponent />} />
          <Route path="airlinereview" element={<AdminAirlineReviewListComponent />} />
          <Route path="/admin/notice" element={<AdminNoticeList />} />
          <Route path="/admin/notice/write" element={<AdminNoticeForm />} />
          <Route path="/admin/notice/:noticeId" element={<AdminNoticeDetail />} />
          <Route path="member" element={<AdminMemberList />} />
          <Route path="member/:memberNo" element={<AdminMemberDetail />} />
        </Route>
    
        {/* 마이페이지(최경환) */}
        <Route path="/mypage" element={<PrivateRoute><MyPageLayout /></PrivateRoute>}>
          <Route index element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="password" element={<PasswordChange />} />
          <Route path="survey" element={<SurveyResult />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="history" element={<SearchHistory />} />
          <Route path="withdraw" element={<Withdraw />} />
        </Route>

        {/* ✅ 취향 설문(게이트/문항/결과) - 로그인 필수 */}
        <Route
          path="/survey"
          element={
            <PrivateRoute>
              <SurveyShell mode="page" />
            </PrivateRoute>
          }
        >
          {/* /survey */}
          <Route index element={<GatePage />} />

          {/* /survey/question */}
          <Route path="question" element={<QuestionPage />} />
          {/* <Route path="question" element={<div style={{ padding: 40 }}>QUESTION ROUTE OK</div>} /> */}

          {/* /survey/result */}
          <Route path="result" element={<ResultPage />} />
        </Route>

        {/* 소셜 로그인 연결(최경환) */}
        <Route path="/oauth/success" element={<OAuthRedirect />} />

      </Routes>


      {/* 헤더 - 지영재 - */}
      <Footer />

      {/* 카카오톡 상담 버튼 (메인 페이지 고정, 최경환) */}
      {isMainPage && <KakaoChatButton />}

    </div>
  );
}

export default App;

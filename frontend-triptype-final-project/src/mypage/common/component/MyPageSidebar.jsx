import "../../css/MyPageSidebar.css";
import logo from "../../../images/logo.png"
import { useNavigate } from "react-router-dom";

const MyPageSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const move = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className={`mypage-sidebar ${isOpen ? "open" : ""}`}>
      <button className="mypage-close-btn" onClick={onClose}>✕</button>

      <div className="mypage-logo" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" />
      </div>

      <table>
        <tbody>
          <tr onClick={() => move("/mypage/profile")}><td>내 정보</td></tr>
          <tr onClick={() => move("/mypage/password")}><td>비밀번호 변경</td></tr>
          <tr onClick={() => move("/mypage/survey")}><td>설문 결과</td></tr>
          <tr onClick={() => move("/mypage/wishlist")}><td>찜 목록</td></tr>
          <tr onClick={() => move("/mypage/history")}><td>검색 기록</td></tr>
          <tr onClick={() => move("/mypage/withdraw")}><td>회원 탈퇴</td></tr>
        </tbody>
      </table>
    </div>
  );
};

export default MyPageSidebar;

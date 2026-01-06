import "../css/AuthSidebar.css";
import { useNavigate } from "react-router-dom";

const AuthSidebar = ({ isOpen, onClose }) => {

  const navigate = useNavigate();

  const move = (path) => {
    navigate(path);
  };

  const LOGO_URL = `${import.meta.env.VITE_API_BASE_URL}/logo_image/TripType_logo.png`;

  return (
    <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>

      <button className="close-btn" onClick={onClose}>✕</button>

      <div className="admin-logo" onClick={() => navigate("/")}>
        <img src={LOGO_URL} alt="logo" />
      </div>

      <table>
        <tbody>
          <tr onClick={() => move("/admin/statistics")}><td>통계</td></tr>
          <tr onClick={() => move("/admin/flight")}><td>항공권 관리</td></tr>
          <tr onClick={() => move("/admin/airlinereview")}><td>댓글 관리</td></tr>
          <tr onClick={() => move("/admin/member")}><td>회원 관리</td></tr>
          <tr onClick={() => move("/admin/notice")}><td>공지사항 관리</td></tr>
        </tbody>
      </table>

    </div>
  );
};

export default AuthSidebar;

import "../css/AuthSidebar.css";

import logo from "../../../images/logo.png"

import {useNavigate} from "react-router-dom";

const AuthSidebar =({ isOpen, onClose }) => {

    const navigate = useNavigate();

    // 메뉴 이동 + 사이드바 달기
    const move = (path) => {
        navigate(path);
        onClose();
    }

    return (
        <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>

            <button className="close-btn" onClick={onClose}>✕</button>
            
            <div className="logo" onClick ={ ()=> {navigate("/");}}><img src={logo} alt="logo"/></div> 
                <table>
                    <tbody>
                        <tr onClick ={ ()=> {navigate("/admin/statistics"); }}><td>통계</td></tr> 
                        <tr onClick = { () => {navigate("/admin/flight");}}><td>항공권 관리</td></tr> 
                        <tr><td>리뷰 관리</td></tr> 
                        <tr><td>회원 관리</td></tr> 
                        {/* 관리자 공지 연결 추가 (김동윤) */}
                        {/* 관리자 공지댓글 연결 수정 (12.17 김동윤) */}
                        <tr onClick ={ ()=> {navigate("/admin/notice"); }}><td>공지사항 관리</td></tr> 
                        {/* <tr onClick ={ ()=> {navigate("/admin/notice/comment"); }}><td>공지사항 댓글 관리</td></tr>  */}

                    </tbody>
                </table>
            
        </div>

    ); 

};
export default AuthSidebar;
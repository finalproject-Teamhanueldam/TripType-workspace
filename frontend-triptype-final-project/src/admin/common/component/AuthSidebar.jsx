import "../css/AuthSidebar.css";

import logo from "../../../images/logo.png"

import {useNavigate} from "react-router-dom";

const AuthSidebar =() => {

    const navigate = useNavigate();

    return (
        <div className="sidebar">
            <div className="logo" onClick ={ ()=> {navigate("/");}}><img src={logo} alt="logo"/></div> 
                <table>
                    <tbody>
                        <tr onClick ={ ()=> {navigate("/admin/statistics"); }}><td>통계</td></tr> 
                        <tr onClick = { () => {navigate("/admin/airlineticket");}}><td>항공권 관리</td></tr> 
                        <tr><td>리뷰 관리</td></tr> 
                        <tr><td>회원 관리</td></tr> 
                        <tr><td>공지사항 관리</td></tr> 
                        <tr><td>공지사항 댓글 관리</td></tr> 

                    </tbody>
                </table>
            
        </div>

    ); 

};
export default AuthSidebar;
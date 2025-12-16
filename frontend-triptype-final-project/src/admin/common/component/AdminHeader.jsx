import "../css/AdminHeader.css";

const AdminHeader = ({ onMenuClick }) => {

        const today = new Date().toISOString().slice(0, 10);

    return(
        <div className="admin-header">

            {/* 좌측: 메뉴 버튼 */}
            <button className="menu-btn" onClick={onMenuClick}>
                ☰
            </button>

            <div className="today-date">{today}</div>

            <div className="admin-header-right">

                <span className="admin-name">관리자</span>
                <button className="logout-btn">로그아웃</button>
            </div>
        </div>
    );
};
export default AdminHeader;
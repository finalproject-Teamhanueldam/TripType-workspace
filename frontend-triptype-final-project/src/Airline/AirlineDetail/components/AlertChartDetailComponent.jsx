import ad from '../../../assets/ad.png';
import "../css/TotalCss.css";
import { useNavigate } from 'react-router-dom';

const AlertChartDetailComponent = () => {

  const navigate = useNavigate();

  return (
    <div className="chart-card">
      {/* 아래 설명 박스 */}
      <div className="info-box">
        <p className="info-text">
          <strong style={{color : "#1E5EFF"}}>예약 전 확인사항</strong><br />
          이 항공편의 실제 정보는 항공사에 따라<br/><span>차이</span>가 있을 수 있습니다.
        </p>
        <span style={{fontSize : "13px", color : "#555"}}>해당 국가의 현황을 확인해보세요!</span>
        <button className="move-btn" onClick={() => navigate("/airline/travelAlert") }>여행 경보 페이지 이동</button>

        <div className="ad-box">
          <img src={ad} alt="광고" className="ad-img" />
        </div>
      </div>

    </div>
  );
};

export default AlertChartDetailComponent;

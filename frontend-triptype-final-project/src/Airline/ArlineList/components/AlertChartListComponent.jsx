import ad from '../../../assets/ad.png';
import "../../AirlineDetail/css/TotalCss.css"
import "../css/AlertChartListComponent.css";

const AlertChartListComponent = () => {

  return (
    <div className="chart-card">
      {/* 아래 설명 박스 */}
      <div className="info-box">
        <p className="info-text">
          <strong style={{color : "#1E5EFF"}}>예약 전 확인사항</strong><br />
          이 항공편의 실제 정보는 항공사에 따라<br/><span>차이</span>가 있을 수 있습니다.
        </p>
        <div className="ad-box">
          <img src={ad} alt="광고" className="ad-img" />
        </div>
      </div>

    </div>
  );
};

export default AlertChartListComponent;

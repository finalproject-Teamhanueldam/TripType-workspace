import ad from '../../../assets/ad.png';
import { Chart } from "react-google-charts";
import "../css/TotalCss.css";
import "../css/TicketPriceChart.css";

const TicketPriceChart = () => {
  const data = [
    ["Year", "가격"],
    ["2013", 1000],
    ["2014", 1170],
    ["2015", 660],
    ["2016", 1030],
  ];

  const options = {
    chartArea: { top: 30, bottom: 40, left: 50, right: 20 },
    legend: { position: "bottom" },
    lineWidth: 3,
    pointSize: 6,
  };

  return (
    <div className="chart-card">

      {/* 가격 차트 */}
      <div className="chart-box">
        <Chart
          chartType="LineChart"
          width="100%"
          height="240px"
          data={data}
          options={options}
        />
      </div>

      {/* 아래 설명 박스 */}
      <div className="info-box">
        <p className="info-text">
          <strong style={{color : "#1E5EFF"}}>예약 전 확인사항</strong><br />
          이 항공편의 실제 정보는 항공사에 따라<br/><span>차이</span>가 있을 수 있습니다.
        </p>

        <button className="move-btn">항공사 이동</button>

        <div className="ad-box">
          <img src={ad} alt="광고" className="ad-img" />
        </div>
      </div>

    </div>
  );
};

export default TicketPriceChart;

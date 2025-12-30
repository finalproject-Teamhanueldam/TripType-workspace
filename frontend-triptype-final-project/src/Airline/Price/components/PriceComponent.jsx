import "../css/PriceComponent.css";
import { Chart } from "react-google-charts";

const PriceComponent = () => {
  const data = [
    ["Year", "가격"],
    ["2013", 1000],
    ["2014", 1170],
    ["2015", 660],
    ["2016", 1030],
  ];

  const options = {
    chartArea: { top: 30, bottom: 40, left: 50, right: 20 },
    legend: { position: "none" },
    lineWidth: 3,
    pointSize: 6,
    hAxis: {
      textStyle: { fontSize: 12 },
    },
    vAxis: {
      textStyle: { fontSize: 12 },
    },
  };

  return (
    <div className="price-card">
      {/* 헤더 */}
      <div className="price-card-header">
        <h3>가격 변동 추이</h3>
        <span className="sub-text">최근 4년 기준</span>
      </div>

      {/* 차트 */}
      <div className="chart-box">
        <Chart
          chartType="LineChart"
          width="100%"
          height="220px"
          data={data}
          options={options}
        />
      </div>

      {/* 요약 정보 */}
      <div className="price-summary">
        <div>
          <span className="label up">▲ 최저가</span>
          <strong>66,000원</strong>
        </div>
        <div>
          <span className="label down">▼ 최고가</span>
          <strong>117,000원</strong>
        </div>
        <div>
          <span className="label">평균가</span>
          <strong>96,500원</strong>
        </div>
      </div>

      {/* 안내 문구 */}
      <p className="price-info">
        ℹ 해당 노선의 과거 가격을 기반으로 한 예측 정보입니다.
      </p>
    </div>
  );
};

export default PriceComponent;

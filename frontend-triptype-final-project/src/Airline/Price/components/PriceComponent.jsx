import { useEffect } from "react";
import "../css/PriceComponent.css";
import { Chart } from "react-google-charts";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const PriceComponent = () => {

  const { state } = useLocation();

  const navigate = useNavigate();

  const search = state.searchParams;
  
  const data = [
    ["Week", "가격"],
    ["01-05", 1000],
    ["01-06", 1170],
    ["01-07", 660],
    ["01-08", 1030],
    ["01-09", 1030],
    ["01-10", 1030],
    ["01-11", 1030],
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

  useEffect(() => {
    if(state == null) {
      toast.info("옳바른 항공권 가격 조회가 아닙니다.");
      navigate("/");
      return;
    }

    const getPrice = async () => {
      try {
        const url = "http://localhost:8001/triptype/airline/select/price";
        const method = "get";

        const response = await axios({
          url,
          method,
          params : { 
                     departDate : search.departDate, 
                     tripType : search.tripType, 
                     depart : search.depart, 
                     arrive : search.arrive 
                   }
        });
          console.log(response.data);
      } 
      catch(error) {

      }
    };
    getPrice();
  }, [search]);

  return (
    <div className="price-card">
      {/* 헤더 */}
      <div className="price-card-header">
        <h3>가격 변동 추이</h3>
        <span className="sub-text">최근 7일 기준</span>
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

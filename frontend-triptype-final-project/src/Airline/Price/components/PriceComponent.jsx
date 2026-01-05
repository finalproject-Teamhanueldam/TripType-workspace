import { useEffect, useState } from "react";
import "../css/PriceComponent.css";
import { Chart } from "react-google-charts";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const PriceComponent = () => {

  const { state } = useLocation();

  const navigate = useNavigate();

  const search = state.searchParams;

  const [priceData, setPriceData] = useState([]);

  console.log(priceData);

  // 날짜별로 정렬
  const sortedPriceData = [...priceData].sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  // 최저가, 최고가, 평균가 구하기 함수
  const price = (sortedPriceData) => {
    if (sortedPriceData.length === 0) return;
    // 최저가
    let min = sortedPriceData[0][1];
    // 최고가
    let max = sortedPriceData[0][1];
    // 합
    let sum = 0;

    sortedPriceData.forEach((item) => {
      let price = item[1];

      if(price < min) min = price;
      if(price > max) max = price;

      sum += price;
    });

    // 평균가
    let avg = sum / sortedPriceData.length;

    return {
      min, 
      max, 
      sum, 
      avg
    };
  };

  const priceInfo = price(sortedPriceData);

  

  const data = [
    ["Week", "가격"],
    ...sortedPriceData,
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
          setPriceData(
            response.data.map((item) => [
              item.departDate.slice(5),
              item.price * 1690
            ])
          );
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
          <strong>{ priceInfo?.min.toLocaleString() }원</strong>
        </div>
        <div>
          <span className="label down">▼ 최고가</span>
          <strong>{ priceInfo?.max.toLocaleString() }원</strong>
        </div>
        <div>
          <span className="label">평균가</span>
          <strong>{ priceInfo?.avg.toLocaleString() }원</strong>
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

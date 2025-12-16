import axios from "axios";
import "../css/TravelAlertComponent.css";
import { useEffect, useState } from "react";

const TravelAlert = () => {

  /* ================= 상태 ================= */
  const [continent, setContinent] = useState("ALL");

  /* ================= 여행경보 단계 정의 (고정값) ================= */
  const ALERT_STEP = {
    1: { label: "여행유의", className: "level-1", desc: "신변안전 유의" },
    2: { label: "여행자제", className: "level-2", desc: "여행 필요성 재검토" },
    3: { label: "출국권고", className: "level-3", desc: "긴급상황 대비" },
    4: { label: "여행금지", className: "level-4", desc: "즉시 철수" },
  };

  /* ================= 실제 데이터 (API 연동 예정) ================= */
  // 예: API에서 받아온 여행경보 리스트
  const travelAlerts = [];

  useEffect(() => {
    const callApi = async () => {
        let url = "https://apis.data.go.kr/1262000/TravelAlarmService2";
        const method = "get";
        const key = "362aa0570e7649d21a2fc257f38b9b581907fb4e63b349969548efebeeac895a";

        url += "?ServiceKey=" + key;
        url += "&returnType=json";
        url += "&numOfRows=10";
        url += "&pageNo=1";

        try {
            const response = await axios({
                url,
                method,
            });

            console.log(response);
        
        } catch(error) {
        
            console.log(error);
        
        }
    };
    callApi();
  }, []);

  /* ================= 필터링 ================= */
  const filteredList =
    continent === "ALL"
      ? travelAlerts
      : travelAlerts.filter((item) => item.continent === continent);

  return (
    <div className="travel-alert-container">

      {/* ================= 여행경보 단계 안내 ================= */}
      <section className="alert-step-guide">
        <div className="section-header">
          <h3>여행경보 단계 안내</h3>
          <p>외교부 기준 국가별 여행 위험 수준</p>
        </div>

        <div className="step-list">
          {Object.entries(ALERT_STEP).map(([key, value]) => (
            <div key={key} className="step-item">
              <div className={`step-number ${value.className}`}>{key}</div>
              <div>
                <p className="step-title">{value.label}</p>
                <p className="step-desc">{value.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 요약 카드 (데이터 연동 예정) ================= */}
      <section className="summary-cards">
        <div className="summary-card">
          <p className="count">-</p>
          <p className="label">전체 국가</p>
        </div>
        <div className="summary-card level-1">
          <p className="count">-</p>
          <p className="label">여행유의</p>
        </div>
        <div className="summary-card level-2">
          <p className="count">-</p>
          <p className="label">여행자제</p>
        </div>
        <div className="summary-card level-3">
          <p className="count">-</p>
          <p className="label">출국권고</p>
        </div>
        <div className="summary-card level-4">
          <p className="count">-</p>
          <p className="label">여행금지</p>
        </div>
      </section>

      {/* ================= 대륙 필터 ================= */}
      <section className="continent-filter">
        {["ALL", "아시아", "유럽", "아프리카", "북미", "남미", "오세아니아"].map(
          (item) => (
            <button
              key={item}
              className={continent === item ? "active" : ""}
              onClick={() => setContinent(item)}
            >
              {item === "ALL" ? "전체" : item}
            </button>
          )
        )}
      </section>

      {/* ================= 테이블 ================= */}
      <section className="alert-table">
        <table>
          <thead>
            <tr>
              <th>국가</th>
              <th>대륙</th>
              <th>경보단계</th>
              <th>주요 내용</th>
              <th>최종 업데이트</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>
                  데이터가 없습니다
                </td>
              </tr>
            ) : (
              filteredList.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <strong>{item.country}</strong>
                    <div className="eng">{item.eng}</div>
                  </td>
                  <td>{item.continent}</td>
                  <td>
                    <span className={`badge ${ALERT_STEP[item.level].className}`}>
                      {item.level} {ALERT_STEP[item.level].label}
                    </span>
                  </td>
                  <td>{item.description}</td>
                  <td>{item.updatedAt}</td>
                  <td className="detail-link">보기</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

    </div>
  );
};

export default TravelAlert;

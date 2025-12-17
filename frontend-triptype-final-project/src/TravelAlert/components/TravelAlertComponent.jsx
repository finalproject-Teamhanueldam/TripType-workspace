import "../css/TravelAlertComponent.css";

import axios from "axios";
import { useEffect, useState } from "react";

import WorldMapComponent from "./WorldMapComponent";

const TravelAlert = () => {
  /* ================= 상태 ================= */
  const [continent, setContinent] = useState("아시아");

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
  const [travel, setTravel] = useState(travelAlerts);

  useEffect(() => {
    // 스프링 부트로 요청 시도하기
    const callApi = async () => {
      let url = "http://localhost:8001/triptype/travelAlert/get";
      const method = "get";

      try {
        const response = await axios({
          url,
          method,
        });

        const items = response.data.response.body.items.item;

        let groupByCountry = {};

        items.forEach((item) => {
          let {
            country_iso_alp2,
            country_nm,
            country_eng_nm,
            continent_cd,
            continent_eng_nm,
            continent_nm,
            alarm_lvl,
            region_ty,
          } = item;

          if (continent_nm == "아주") {
            continent_nm = "아시아";
          }

          let key = item.country_iso_alp2;
          if (!groupByCountry[key]) {
            groupByCountry[key] = {
              country_iso_alp2,
              country_nm,
              country_eng_nm,
              continent_cd,
              continent_eng_nm,
              continent_nm,
              region: [region_ty],
              levels: [Number(alarm_lvl)],
            };
          } else {
            groupByCountry[key].region.push(item.region_ty);
            groupByCountry[key].levels.push(Number(item.alarm_lvl));
          }
        });

        const fixedTravelAlerts = Object.values(groupByCountry).map((item, index) => {
          return {
            ...item,
            alertLevel : getAlertLevel(item)
          }
        })

        setTravel(fixedTravelAlerts);
      } catch (error) {
        console.log(error);
      }
    };
    callApi();
  }, []);

  /* ================= 대륙별 필터링된 데이터 리스트 ================= */
  const filteredList = travel.filter((item) => item.continent_nm == continent);

  /* ================= 대륙별 경보 단계 ================= */
  const getAlertLevel = (item) => {
    // 경보 단계는 최고 위험도 우선

    let hasAll = item.region.includes("전체");
    let hasPart = item.region.includes("일부");

    let has1 = item.levels.includes(1);
    let has2 = item.levels.includes(2);
    let has3 = item.levels.includes(3);
    let has4 = item.levels.includes(4);

    if (hasAll) {
      if (item.levels.includes(1)) return 1;
      if (item.levels.includes(4)) return 4;

      if (has2) return 2;
      if (has3) return 3;
    }

    if (hasPart && !hasAll) {
      // 일부이지만 1만 포함된 경우
      if (has1 && !has2 && !has3 && !has4) return 1;

      // 일부이지만 4가 포함된 경우
      if (!has1 && !has2 && !has3 && has4) return 4;
      if (!has1 && !has2 && has3 && has4) return 3;

      // 일부가 1, 2, 3이지만 4가 없을 경우 1
      if (has1 && has2 && has3 && !has4) return 1;

      // 일부가 1, 2, 3, 4 다 있는 경우 2
      if (has1 && has2 && has3 && has4) return 2;

      if (has2 && has3 && !has4) return 2;

      if (has1 && has2 && !has4) return 1;
      if (has1 && has2 && has4) return 2;

      if (has1 && has3 && !has4) return 1;
      if (has1 && has3 && has4) return 2;

      if (has3 && !has1 && !has2 && !has4) return 1;

      if (has1 && has4) return 2;

      if(!has1 && has2 && !has3 && !has4) return 2;
      if(!has1 && !has2 && has3 && !has4) return 3;
    }

    return 4;
  };

  let alertCount = {
    1 : 0,
    2 : 0,
    3 : 0,
    4 : 0,
  }

  travel.forEach((item) => {
    let level = getAlertLevel(item)
    alertCount[level]++;
  });



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
          <p className="count">{travel.length}</p>
          <p className="label">전체 국가</p>
        </div>
        <div className="summary-card level-1">
          <p className="count">{alertCount[1]}</p>
          <p className="label">여행유의</p>
        </div>
        <div className="summary-card level-2">
          <p className="count">{alertCount[2]}</p>
          <p className="label">여행자제</p>
        </div>
        <div className="summary-card level-3">
          <p className="count">{alertCount[3]}</p>
          <p className="label">출국권고</p>
        </div>
        <div className="summary-card level-4">
          <p className="count">{alertCount[4]}</p>
          <p className="label">여행금지</p>
        </div>
      </section>

      <div>
        <WorldMapComponent travel={travel} />
      </div>

      {/* ================= 대륙 필터 ================= */}
      {/* 버튼을 누르면 색상이 파란색으로 */}
      <section className="continent-filter">
        {["아시아", "유럽", "아프리카", "미주", "오세아니아"].map(
          (item, idx) => (
            <button
              key={idx}
              className={continent == item ? "active" : ""}
              onClick={() => setContinent(item)}
            >
              {item}
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
                    <strong>{item.country_nm}</strong>
                    <div className="eng">{item.country_eng_nm}</div>
                  </td>
                  <td>{item.continent_nm}</td>
                  <td>
                    <span
                      className={`alert-badge ${
                        ALERT_STEP[getAlertLevel(item)].className
                      }`}
                    >
                      {getAlertLevel(item)} {ALERT_STEP[getAlertLevel(item)].label}
                    </span>
                  </td>
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
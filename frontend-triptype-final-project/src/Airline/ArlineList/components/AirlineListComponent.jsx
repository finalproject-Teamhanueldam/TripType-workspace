import "../css/AirlineListComponent.css";
import TicketBoxComponent from "../../common/TicketBoxComponent.jsx";
import AlertChartListComponent from "./AlertChartListComponent.jsx"
import AirlineModalComponent from "./AirlineModalComponent.jsx";
import data from "./data.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const tripList = data;

const AirlineListComponent = () => {

  const navigate = useNavigate();


  // 일주일간 최저가 상단 데이터
  let weekPriceList = [
  { date: "12월20일", price: "-" },
  { date: "12월21일", price: "-" },
  { date: "12월22일", price: "8.6만" },
  { date: "12월23일", price: "10.4만" },
  { date: "12월24일", price: "-" },
  { date: "12월25일", price: "6만" },
  { date: "12월26일", price: "-" },
  ]

  // 필터
  const filterList = ["최저가", "비행시간순", "늦은출발"];


  // 경유 필터
  const transitList = ["직항", "1회 경유", "2회 이상"];


  // 항공사
  const airline = ["대한항공", "아시아나", "티웨이"];


  // State
  // 일주일간 최저가 상단 Status
  const [ activeDay, setActiveDay ] = useState();

  // 필터링 Status (최저가 / 비행시간순)
  const [ activeFilter, setActiveFilter ] = useState(0);

  // 경유 필터
  const [ activeTransit, setActiveTransit ] = useState([]);

  // 출발 시간대
  const [ departureTime, setDepartureTime ] = useState(0);

  // 항공사
  const [ airlineStatus, setAirlineStatus ] = useState();

  // 모달창 (왕복, 경유일 경우)
  const [ open, setOpen ] = useState(false);






// 변경 함수
  // 일주일간 최저가 상단 Status 변경 함수
  const changeDay = (index) => {
    setActiveDay(index);
    setActiveFilter(0);
  };

  // 필터링 Status (최저가 / 비행시간순) 변경 함수
  const changeFilter = (index) => {
    setActiveFilter(index);
  };

  // 경유 변경 함수
  const changeTransit = (index) => {
    const target = transitList[index];
    setActiveTransit((prev) => {
      if(prev.includes(target)) {
        const filtered = prev.filter((item) => item != target);
        return filtered;
      } else {
        return [...prev, transitList[index]];
      }
    });
  };

  // 출발 시간대 변경 함수
  const changeTime = (value) => {
    setDepartureTime(Number(value));
  }

  let hour = Math.floor(departureTime / 60);
  let minute = departureTime % 60;

  if(hour < 10) {
    hour = "0" + hour;
  }

  if(minute < 10) {
    minute = "0" + minute;
  }

  // 항공사 변경
  const changeAirline = (index) => {
    setAirlineStatus(airline[index]);
  };



  return (
    <div className="airline-list-wrapper">
      {/* ================= 가격 요약 ================= */}
      <section className="price-table-wrapper">
        <table>
          <tbody>
            <tr>
              {
                weekPriceList.map(({date, price}, index) => 
                  <td key={index} className={ activeDay == index ? "active" : "" } onClick={() => changeDay(index)}>
                    <p className="date">{date}</p>
                    <p className="price">{price}</p>
                  </td>
                )
              }
            </tr>
          </tbody>
        </table>
      </section>

      {/* ================= 메인 레이아웃 ================= */}
      <div className="airline-list">
        {/* ===== 좌측 필터 ===== */}
        <aside className="side-1">
          <div className="filter-card">
            <div className="filter-section">
              <strong>경유</strong>
              {
                transitList.map((item, index) => 
                  <label key={index}>
                    <input type="checkbox" value={item} onChange={() => changeTransit(index)}/>{item}
                  </label>
                )
              }
            </div>

            <div className="filter-section">
              <strong>출발 시간대</strong>
              <p>오전 00:00 - 오후 {hour}:{minute}</p>
              <input type="range" min="0" max="1440" step="5" onChange={(e) => { changeTime(e.target.value) }}/>
            </div>

            <div className="filter-section">
              <strong>항공사</strong>
              <div className="airline-btns">
                {
                  airline.map((item, index) => 
                    <button key={index} 
                            value={item} 
                            onClick={() => changeAirline(index)}
                            className={airlineStatus == item ? "active" : ""}
                            >{item}</button>
                  )
                }
              </div>
            </div>
          </div>
        </aside>

        <AirlineModalComponent open={open} onClose={() => setOpen(false)}/>

        {/* ===== 메인 리스트 ===== */}
        <main>
          {/* 정렬 */}
          <div className="airline-ticket-sort">
            <div className="sort-tabs">
              <span className={ activeFilter == 0 ? "active" : "" } onClick={() => changeFilter(0)}>최저가</span>
              <span className={ activeFilter == 1 ? "active" : "" } onClick={() => changeFilter(1)}>비행시간순</span>
            </div>

            <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
              {
                filterList.map((item, index) => 
                  <option key={index} value={index}>{ item }</option>
                )
              }
            </select>
          </div>

          <p className="result-count">
            {tripList.length}개의 검색 결과 ·
            <span className="price-check" onClick={() => {navigate("/airline/list/price")}}>가격변동 조회</span>
          </p>

          {tripList.map((item, index) => (
            <TicketBoxComponent
              key={index}
              segment={item}
              tripType={item.type}
              setOpen={() => setOpen(true)}
              showPlus={item.type != "ONE" ? true : false }
            />
          ))}
        </main>

        {/* ===== 우측 광고 ===== */}
        <aside className="side-2">
          <AlertChartListComponent/>
        </aside>
      </div>
    </div>
  );
};

export default AirlineListComponent;

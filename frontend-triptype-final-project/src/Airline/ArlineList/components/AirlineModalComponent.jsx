import "../css/AirlineModalComponent.css";

const AirlineModalComponent = ({ open, onClose, pair }) => {
  if (!open || !pair) return null;

  const { outbound, inbound } = pair;

  // 날짜/시간 포맷 함수 (필요 시 외부 유틸로 분리)
  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("ko-KR", { 
        weekday: 'short', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
    });
  };

  const getTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("ko-KR", { 
        hour12: false, hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="airline-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-top">
          <h2>{outbound.departCity} ⇄ {outbound.arriveCity}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="flight-content">
          {/* 가는 편 (Outbound) */}
          <div className="flight-section">
            <div className="section-header">
              <span className="badge depart">가는 편</span>
              <span>{formatDateTime(outbound.departDate)}</span>
            </div>

            <div className="timeline">
              <div className="time-block">
                <span className="time">{getTime(outbound.departDate)}</span>
                <div className="info">
                  <strong>{outbound.departAirportCode} {outbound.departCity}</strong>
                </div>
              </div>

              <div className="transfer-line">
                <span className="duration-label">소요 시간: {outbound.flightDuration.replace('PT','').replace('H','시간 ').replace('M','분')}</span>
              </div>

              <div className="time-block">
                <span className="time">{getTime(outbound.arriveDate)}</span>
                <div className="info">
                  <strong>{outbound.arriveAirportCode} {outbound.arriveCity}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 오는 편 (Inbound - 왕복일 때만 렌더링) */}
          {inbound && (
            <div className="flight-section">
              <div className="section-header">
                <span className="badge return">오는 편</span>
                <span>{formatDateTime(inbound.departDate)}</span>
              </div>

              <div className="timeline">
                <div className="time-block">
                  <span className="time">{getTime(inbound.departDate)}</span>
                  <div className="info">
                    <strong>{inbound.departAirportCode} {inbound.departCity}</strong>
                  </div>
                </div>

                <div className="transfer-line">
                   <span className="duration-label">소요 시간: {inbound.flightDuration.replace('PT','').replace('H','시간 ').replace('M','분')}</span>
                </div>

                <div className="time-block">
                  <span className="time">{getTime(inbound.arriveDate)}</span>
                  <div className="info">
                    <strong>{inbound.arriveAirportCode} {inbound.arriveCity}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AirlineModalComponent;
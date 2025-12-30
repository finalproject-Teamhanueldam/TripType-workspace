import "../css/AirlineModalComponent.css";

const AirlineModalComponent = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="airline-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* 상단 헤더 */}
        <div className="modal-top">
          <h2>Seoul ⇄ Dar es salaam</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* 본문 */}
        <div className="flight-content">

          {/* 가는 편 */}
          <div className="flight-section">
            <div className="section-header">
              <span className="badge depart">Depart</span>
              <span>Tue, Jan 20, 2026 · Duration 17h 5m</span>
            </div>

            <div className="timeline">
              <div className="time-block">
                <span className="time">00:05</span>
                <div className="info">
                  <strong>ICN Seoul Incheon Intl. T1</strong>
                </div>
              </div>

              <div className="transfer">
                <span>Transfer in Addis Ababa 1h</span>
                <span className="warning">⚠ Short transfer time</span>
              </div>

              <div className="time-block">
                <span className="time">11:10</span>
                <div className="info">
                  <strong>DAR Dar es salaam Julius Nyerere Intl. T3</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 오는 편 */}
          <div className="flight-section">
            <div className="section-header">
              <span className="badge return">Return</span>
              <span>Tue, Jan 27, 2026 · Duration 15h</span>
            </div>

            <div className="timeline">
              <div className="time-block">
                <span className="time">18:45</span>
                <div className="info">
                  <strong>DAR Dar es salaam Julius Nyerere Intl. T3</strong>
                </div>
              </div>

              <div className="transfer">
                <span>Transfer in Addis Ababa 1h 10m</span>
                <span className="warning">⚠ Short transfer time</span>
              </div>

              <div className="time-block">
                <span className="time">15:45</span>
                <div className="info">
                  <strong>ICN Seoul Incheon Intl. T1</strong>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AirlineModalComponent;

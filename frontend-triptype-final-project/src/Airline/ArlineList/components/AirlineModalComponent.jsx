import "../css/AirlineModalComponent.css";

const AirlineModalComponent = ({ open, onClose, pair }) => {
  if (!open || !pair) return null;

  const outbound = pair?.outbound || null;
  const inbound = pair?.inbound || null;

  // ✅ MULTI/경유(편도) 대응: segments가 있으면 우선 사용
  const segments =
    Array.isArray(pair?.segments) && pair.segments.length > 0 ? pair.segments : null;

  // 날짜/시간 포맷 함수
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString("ko-KR", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("ko-KR", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (dur) => {
    if (!dur || typeof dur !== "string") return "";
    return dur
      .replace("PT", "")
      .replace("H", "시간 ")
      .replace("M", "분")
      .trim();
  };

  // ✅ 상단 타이틀: MULTI면 첫 출발지 ~ 마지막 도착지
  const titleFrom = segments?.[0] || outbound;
  const titleTo = segments ? segments[segments.length - 1] : outbound;

  // 방어: outbound 자체가 없으면 렌더 불가
  if (!titleFrom || !titleTo) return null;

  // ✅ 공통 섹션 렌더러 (한 편의 segments를 타임라인으로 렌더)
  const renderSegmentTimeline = (segList, badgeText, badgeClass) => {
    if (!Array.isArray(segList) || segList.length === 0) return null;

    const first = segList[0];
    const last = segList[segList.length - 1];

    return (
      <div className="flight-section">
        <div className="section-header">
          <span className={`badge ${badgeClass}`}>{badgeText}</span>
          <span>{formatDateTime(first.departDate)}</span>
        </div>

        <div className="timeline">
          {/* 첫 출발 */}
          <div className="time-block">
            <span className="time">{getTime(first.departDate)}</span>
            <div className="info">
              <strong>
                {first.departAirportCode} {first.departCity}
              </strong>
            </div>
          </div>

          {/* 중간 구간들(경유/다구간) */}
          {segList.map((seg, idx) => {
            const isLast = idx === segList.length - 1;

            return (
              <div key={idx}>
                <div className="transfer-line">
                  <span className="duration-label">
                    소요 시간: {formatDuration(seg.flightDuration)}
                  </span>

                  {/* ✅ 다음 구간이 있으면 "경유지" 표시 */}
                  {!isLast && (
                    <span className="duration-label" style={{ marginLeft: 10 }}>
                      경유: {seg.arriveAirportCode} {seg.arriveCity}
                    </span>
                  )}
                </div>

                {/* 마지막 도착만 출력(중간 도착은 경유 라벨로만) */}
                {isLast && (
                  <div className="time-block">
                    <span className="time">{getTime(last.arriveDate)}</span>
                    <div className="info">
                      <strong>
                        {last.arriveAirportCode} {last.arriveCity}
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ✅ MULTI(다구간): pair.segments를 그대로 한 섹션으로 보여줌
  const renderMulti = () => {
    return renderSegmentTimeline(segments, "다구간", "depart");
  };

  // ✅ 편도/경유(편도): segments가 있으면 segments로, 없으면 outbound 1개로
  const renderOneWay = () => {
    if (segments) return renderSegmentTimeline(segments, "가는 편", "depart");
    return renderSegmentTimeline([outbound], "가는 편", "depart");
  };

  // ✅ 왕복: outbound + inbound
  const renderRound = () => {
    return (
      <>
        {renderSegmentTimeline([outbound], "가는 편", "depart")}
        {inbound && renderSegmentTimeline([inbound], "오는 편", "return")}
      </>
    );
  };

  const tripType = pair?.tripType; // 있을 수도 있고 없을 수도 있음
  // ✅ tripType이 안 내려오는 경우: inbound 있으면 ROUND, segments 길이>1이고 outbound/inbound 없으면 MULTI로 추정
  const resolvedType =
    tripType ||
    (inbound ? "ROUND" : segments && segments.length > 1 ? "MULTI" : "ONEWAY");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="airline-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top">
          <h2>
            {titleFrom.departCity} ⇄ {titleTo.arriveCity}
          </h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="flight-content">
          {resolvedType === "MULTI"
            ? renderMulti()
            : resolvedType === "ROUND"
            ? renderRound()
            : renderOneWay()}
        </div>
      </div>
    </div>
  );
};

export default AirlineModalComponent;

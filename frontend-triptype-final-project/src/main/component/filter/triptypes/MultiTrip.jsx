import { useRef } from "react";
import { AiFillDelete } from "react-icons/ai";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import "../../../style/filter/triptypes/MultiTrip.css";

const MAX_MULTI_SEGMENTS = 6;

const MultiTrip = ({
  segments = [],
  setSegments,
  onOpenCalendar,
}) => {
  const svgRefs = useRef({});
  const navigate = useNavigate();

  const addSegment = () => {
    if (segments.length >= MAX_MULTI_SEGMENTS) return;

    setSegments((prev) => [
      ...prev,
      {
        id: Date.now(),
        departure: "",
        arrival: "",
        date: null,
      },
    ]);
  };

  const removeSegment = (id) => {
    if (segments.length === 1) return;

    setSegments((prev) => prev.filter((seg) => seg.id !== id));
    delete svgRefs.current[id];
  };

  const handleSwap = (id) => {
    setSegments((prev) =>
      prev.map((seg) =>
        seg.id === id && seg.departure && seg.arrival
          ? { ...seg, departure: seg.arrival, arrival: seg.departure }
          : seg
      )
    );

    svgRefs.current[id]?.animate(
      [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
      { duration: 400, easing: "ease-in-out", fill: "none" }
    );
  };

  /* 🔥 검색 버튼 클릭 (다구간) */
  const handleSearch = () => {
    // 1️⃣ 모든 구간 유효성 검사
    const isInvalid = segments.some(
      (seg) => !seg.departure || !seg.arrival || !seg.date
    );

    if (isInvalid) {
      alert("모든 구간의 출발지, 도착지, 날짜를 입력하세요");
      return;
    }

    // 2️⃣ 다구간 배열 직렬화
    const serializedSegments = segments.map((seg) => ({
      departure: seg.departure,
      arrival: seg.arrival,
      date: format(seg.date, "yyyy-MM-dd"),
    }));

    const params = new URLSearchParams({
      tripType: "multi",
      segments: JSON.stringify(serializedSegments),
    });

    // airlineNo는 임시값 0
    navigate(`/airline/detail/0?${params.toString()}`);
  };

  const isMax = segments.length >= MAX_MULTI_SEGMENTS;

  return (
    <div className="multi-container">
      {segments.map((seg) => (
        <div className="multi-row multi-trip" key={seg.id}>
          {/* 출발지 */}
          <div className="filter-item">
            <label>출발지</label>
            <input
              placeholder="도시명 또는 공항명"
              value={seg.departure}
              onChange={(e) =>
                setSegments((prev) =>
                  prev.map((s) =>
                    s.id === seg.id
                      ? { ...s, departure: e.target.value }
                      : s
                  )
                )
              }
            />
          </div>

          {/* 스위치 */}
          <button
            type="button"
            className="switch-icon"
            onClick={() => handleSwap(seg.id)}
            disabled={!seg.departure || !seg.arrival}
          >
            <svg
              ref={(el) => (svgRefs.current[seg.id] = el)}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M4 7H20M20 7L16 3M20 7L16 11"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M20 17H4M4 17L8 21M4 17L8 13"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>

          {/* 도착지 */}
          <div className="filter-item">
            <label>도착지</label>
            <input
              placeholder="도시명 또는 공항명"
              value={seg.arrival}
              onChange={(e) =>
                setSegments((prev) =>
                  prev.map((s) =>
                    s.id === seg.id
                      ? { ...s, arrival: e.target.value }
                      : s
                  )
                )
              }
            />
          </div>

          {/* 날짜 */}
          <div
            className="filter-item date-box"
            onClick={() => onOpenCalendar(seg.id)}
            role="button"
            tabIndex={0}
          >
            <label>가는 편</label>
            <input
              readOnly
              tabIndex={-1}
              value={seg.date ? format(seg.date, "yyyy.MM.dd") : "연도-월-일"}
            />
          </div>

          {/* 삭제 */}
          {segments.length > 1 && (
            <button
              type="button"
              className="delete-btn"
              onClick={() => removeSegment(seg.id)}
            >
              <AiFillDelete />
            </button>
          )}
        </div>
      ))}

      {/* 하단 액션 */}
      <div className="multi-action-row">
        <div className="add-segment-wrap">
          <button
            type="button"
            className="add-segment-btn"
            onClick={addSegment}
            disabled={isMax}
          >
            + 다른 항공편 추가
          </button>

          {isMax && (
            <p className="segment-limit-text">
              다구간은 최대 6개까지 추가할 수 있습니다.
            </p>
          )}
        </div>

        {/* 🔍 검색 */}
        <button
          type="button"
          className="filter-section-search-btn"
          onClick={handleSearch}
        >
          검색
        </button>
      </div>
    </div>
  );
};

export default MultiTrip;

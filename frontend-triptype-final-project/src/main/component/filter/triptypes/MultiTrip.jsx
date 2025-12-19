import { useRef, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { format } from "date-fns";
import "../../../css/filter/triptypes/MultiTrip.css";
import { AIRPORTS } from "../../data/Airports";
import { toast } from "react-toastify";

const MAX_MULTI_SEGMENTS = 6;
const normalize = (str = "") => str.trim().toLowerCase();

const MultiTrip = ({
  segments = [],
  setSegments,
  onOpenCalendar,
  onSearch,
}) => {
  const svgRefs = useRef({});
  const wrapRefs = useRef({});

  /* ===============================
     🔹 자동 확정 처리
     =============================== */
  useEffect(() => {
    setSegments((prev) =>
      prev.map((seg) => {
        const departMatch = AIRPORTS.find(
          (a) => normalize(a.label) === normalize(seg.departInput)
        );
        const arriveMatch = AIRPORTS.find(
          (a) => normalize(a.label) === normalize(seg.arrivalInput)
        );

        return {
          ...seg,
          depart: departMatch ?? null,
          arrive: arriveMatch ?? null,
          isDepartConfirmed: !!departMatch,
          isArriveConfirmed: !!arriveMatch,
        };
      })
    );
  }, [
    segments.map((s) => s.departInput).join(),
    segments.map((s) => s.arrivalInput).join(),
  ]);

  /* ===============================
     🔥 바깥 클릭 → 드롭다운 닫기
     =============================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      setSegments((prev) =>
        prev.map((seg) =>
          wrapRefs.current[seg.id] &&
          !wrapRefs.current[seg.id].contains(e.target)
            ? {
                ...seg,
                showDepartDropdown: false,
                showArriveDropdown: false,
              }
            : seg
        )
      );
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [setSegments]);

  const addSegment = () => {
    if (segments.length >= MAX_MULTI_SEGMENTS) return;

    setSegments((prev) => [
      ...prev,
      {
        id: Date.now(),
        departInput: "",
        arrivalInput: "",
        depart: null,
        arrive: null,
        date: null,
        showDepartDropdown: false,
        showArriveDropdown: false,
        isDepartConfirmed: false,
        isArriveConfirmed: false,
      },
    ]);
  };

  const removeSegment = (id) => {
    if (segments.length === 1) return;
    setSegments((prev) => prev.filter((seg) => seg.id !== id));
    delete svgRefs.current[id];
    delete wrapRefs.current[id];
  };

  /* ===============================
     🔁 스왑 (핵심 수정)
     =============================== */
  const handleSwap = (id) => {
    setSegments((prev) =>
      prev.map((seg) =>
        seg.id === id
          ? {
              ...seg,
              departInput: seg.arrivalInput,
              arrivalInput: seg.departInput,
              depart: seg.arrive,
              arrive: seg.depart,
              isDepartConfirmed: seg.isArriveConfirmed,
              isArriveConfirmed: seg.isDepartConfirmed,
            }
          : seg
      )
    );

    svgRefs.current[id]?.animate(
      [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
      { duration: 400, easing: "ease-in-out", fill: "none" }
    );
  };

  /* ===============================
     🔍 검색
     =============================== */
  const handleSearchClick = () => {
    const isInvalid = segments.some(
      (seg) => !seg.isDepartConfirmed || !seg.isArriveConfirmed || !seg.date
    );

    if (isInvalid) {
      toast.error("모든 구간의 출발지, 도착지, 날짜를 입력하세요");
      return;
    }

    onSearch({
      tripType: "MULTI",
      segments: segments.map((seg) => ({
        depart: seg.depart.iata,
        arrive: seg.arrive.iata,
        date: format(seg.date, "yyyy-MM-dd"),
      })),
    });
  };

  return (
    <div className="multi-container">
      {segments.map((seg) => {
        const filteredDepart = AIRPORTS.filter((a) =>
          normalize(a.label).includes(normalize(seg.departInput))
        );
        const filteredArrive = AIRPORTS.filter((a) =>
          normalize(a.label).includes(normalize(seg.arrivalInput))
        );

        return (
          <div
            className="multi-row multi-trip"
            key={seg.id}
            ref={(el) => (wrapRefs.current[seg.id] = el)}
          >
            {/* 출발지 */}
            <div className="filter-item airport-field">
              <label>출발지</label>
              <input
                value={seg.departInput}
                placeholder="도시명 또는 공항명"
                onChange={(e) => {
                  const value = e.target.value;
                  setSegments((prev) =>
                    prev.map((s) =>
                      s.id === seg.id
                        ? {
                            ...s,
                            departInput: value,
                            isDepartConfirmed: false,
                            showDepartDropdown: !!value,
                          }
                        : s
                    )
                  );
                }}
              />

              {seg.showDepartDropdown &&
                !seg.isDepartConfirmed &&
                filteredDepart.length > 0 && (
                  <ul className="airport-dropdown">
                    {filteredDepart.map((a) => (
                      <li
                        key={a.iata}
                        onMouseDown={() => {
                          setSegments((prev) =>
                            prev.map((s) =>
                              s.id === seg.id
                                ? {
                                    ...s,
                                    departInput: a.label,
                                    depart: a,
                                    isDepartConfirmed: true,
                                    showDepartDropdown: false,
                                  }
                                : s
                            )
                          );
                        }}
                      >
                        {a.label} <span className="iata">({a.iata})</span>
                      </li>
                    ))}
                  </ul>
                )}
            </div>

            {/* 스위치 */}
            <button
              type="button"
              className="switch-icon"
              onClick={() => handleSwap(seg.id)}
              disabled={!seg.departInput && !seg.arrivalInput}  // ✅ 핵심 수정
            >
              <svg
                ref={(el) => (svgRefs.current[seg.id] = el)}
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path d="M4 7H20M20 7L16 3M20 7L16 11" />
                <path d="M20 17H4M4 17L8 21M4 17L8 13" />
              </svg>
            </button>

            {/* 도착지 */}
            <div className="filter-item airport-field">
              <label>도착지</label>
              <input
                value={seg.arrivalInput}
                placeholder="도시명 또는 공항명"
                onChange={(e) => {
                  const value = e.target.value;
                  setSegments((prev) =>
                    prev.map((s) =>
                      s.id === seg.id
                        ? {
                            ...s,
                            arrivalInput: value,
                            isArriveConfirmed: false,
                            showArriveDropdown: !!value,
                          }
                        : s
                    )
                  );
                }}
              />

              {seg.showArriveDropdown &&
                !seg.isArriveConfirmed &&
                filteredArrive.length > 0 && (
                  <ul className="airport-dropdown">
                    {filteredArrive.map((a) => (
                      <li
                        key={a.iata}
                        onMouseDown={() => {
                          setSegments((prev) =>
                            prev.map((s) =>
                              s.id === seg.id
                                ? {
                                    ...s,
                                    arrivalInput: a.label,
                                    arrive: a,
                                    isArriveConfirmed: true,
                                    showArriveDropdown: false,
                                  }
                                : s
                            )
                          );
                        }}
                      >
                        {a.label} <span className="iata">({a.iata})</span>
                      </li>
                    ))}
                  </ul>
                )}
            </div>

            {/* 날짜 */}
            <div
              className="filter-item date-box"
              onClick={() => onOpenCalendar(seg.id)}
            >
              <label>가는 편</label>
              <input
                readOnly
                value={
                  seg.date
                    ? format(seg.date, "yyyy.MM.dd")
                    : "연도 - 월 - 일"
                }
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
        );
      })}

      {/* 하단 액션 */}
      <div className="multi-action-row">
        <button
          type="button"
          className="add-segment-btn"
          onClick={addSegment}
          disabled={segments.length >= MAX_MULTI_SEGMENTS}
        >
          + 다른 항공편 추가
        </button>

        <button
          type="button"
          className="filter-section-search-btn"
          onClick={handleSearchClick}
        >
          검색
        </button>
      </div>
    </div>
  );
};

export default MultiTrip;

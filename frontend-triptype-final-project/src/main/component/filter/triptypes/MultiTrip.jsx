import { useRef, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { format } from "date-fns";
import "../../../css/filter/triptypes/MultiTrip.css";
import { AIRPORTS } from "../../data/Airports";
import { toast } from "react-toastify";

const MAX_MULTI_SEGMENTS = 6;
const normalize = (str = "") => String(str).trim().toLowerCase();

/* ✅ 추가: MULTI 체인/날짜 보정 함수 (최소 변경) */
const normalizeMulti = (list = []) => {
  const next = list.map((s) => ({ ...s }));

  // 1) 연속여정 depart 고정: i>0 depart = (i-1 arrive 확정값)
  for (let i = 1; i < next.length; i++) {
    const prev = next[i - 1];
    const curr = next[i];

    const prevArrive = prev?.isArriveConfirmed ? prev?.arrive : null;

    if (!prevArrive) {
      curr.depart = null;
      curr.departInput = "";
      curr.isDepartConfirmed = false;
      curr.showDepartDropdown = false;
    } else {
      curr.depart = prevArrive;
      curr.departInput = prevArrive.label;
      curr.isDepartConfirmed = true;
      curr.showDepartDropdown = false;

      // depart=arrive 방지(기존 값이 남아있을 수 있어 리셋)
      if (curr?.arrive?.iata && curr.arrive.iata === prevArrive.iata) {
        curr.arrive = null;
        curr.arrivalInput = "";
        curr.isArriveConfirmed = false;
        curr.showArriveDropdown = false;
      }
    }
  }

  // 2) 날짜 단조 증가 보정: 뒤 구간 date가 앞보다 빠르면 끌어올림
  for (let i = 1; i < next.length; i++) {
    const prevDate = next[i - 1]?.date;
    const currDate = next[i]?.date;
    if (prevDate && currDate && currDate < prevDate) {
      next[i].date = prevDate;
    }
  }

  return next;
};

/**
 * ✅ MULTI 조건(앞에서 합의한 “연속 여정”)
 * - 0번 구간: depart/arrive 사용자가 직접 선택
 * - i>0 구간: depart는 "이전 구간 arrive"로 자동 고정(사용자 입력 불가)
 * - 날짜는 각 구간별로 개별 선택
 * - 노선 추가 시: 새 구간 depart는 직전 구간 arrive로 자동 채움
 * - 사용자가 중간 경유지를 직접 입력하는 UI가 아니므로(세그먼트 단위) "직항만"을 강제하지는 않음.
 *   (직항 필터는 API 파라미터로 따로 처리하는 영역이라 여기서는 UI/입력 일관성만 보장)
 */
const MultiTrip = ({ segments = [], setSegments, onOpenCalendar, onSearch }) => {
  const svgRefs = useRef({});
  const wrapRefs = useRef({});

  /* ===============================
     ✅ 기본값 보정(중요)
     - i>0 구간 departInput은 UI에서 보여주되 수정 불가로 유지
     =============================== */
  useEffect(() => {
    setSegments((prev) => {
      const nextList = prev.map((seg) => {
        const next = {
          ...seg,
          id: seg?.id ?? Date.now(),

          // 입력 문자열(표시용)
          departInput: seg?.departInput ?? "",
          arrivalInput: seg?.arrivalInput ?? "",

          // 선택된 공항 객체
          depart: seg?.depart ?? null,
          arrive: seg?.arrive ?? null,

          date: seg?.date ?? null,

          showDepartDropdown: !!seg?.showDepartDropdown,
          showArriveDropdown: !!seg?.showArriveDropdown,

          isDepartConfirmed: !!seg?.isDepartConfirmed,
          isArriveConfirmed: !!seg?.isArriveConfirmed,
        };

        const same =
          next.id === seg.id &&
          next.departInput === seg.departInput &&
          next.arrivalInput === seg.arrivalInput &&
          next.depart === seg.depart &&
          next.arrive === seg.arrive &&
          next.date === seg.date &&
          next.showDepartDropdown === seg.showDepartDropdown &&
          next.showArriveDropdown === seg.showArriveDropdown &&
          next.isDepartConfirmed === seg.isDepartConfirmed &&
          next.isArriveConfirmed === seg.isArriveConfirmed;

        return same ? seg : next;
      });

      // ✅ 변경: 체인 보정은 normalizeMulti가 담당(확정 여부까지 고려)
      const chained = normalizeMulti(nextList);

      // 변화 없으면 그대로 반환해서 불필요 렌더 방지
      const isSameList =
        prev.length === chained.length &&
        prev.every((p, i) => p === chained[i]);

      return isSameList ? prev : chained;
    });
  }, [setSegments]);

  /* ===============================
     🔹 arrivalInput 자동 확정 처리
     - departInput 자동 확정은 0번 구간만 허용
     - arrivalInput은 모든 구간 허용
     =============================== */
  useEffect(() => {
    setSegments((prev) => {
      const next = prev.map((seg, idx) => {
        const departInput = seg?.departInput ?? "";
        const arrivalInput = seg?.arrivalInput ?? "";

        // depart 자동확정: 0번 구간만
        const departMatch =
          idx === 0 &&
          departInput &&
          AIRPORTS.find((a) => normalize(a.label) === normalize(departInput));

        // arrive 자동확정: 모든 구간
        const arriveMatch =
          arrivalInput &&
          AIRPORTS.find((a) => normalize(a.label) === normalize(arrivalInput));

        const nextDepart =
          idx === 0 ? departMatch ?? seg.depart ?? null : seg.depart ?? null;
        const nextArrive = arriveMatch ?? seg.arrive ?? null;

        const nextIsDepartConfirmed =
          idx === 0
            ? departMatch
              ? true
              : !!seg.isDepartConfirmed
            : !!seg.isDepartConfirmed;

        const nextIsArriveConfirmed = arriveMatch
          ? true
          : !!seg.isArriveConfirmed;

        const same =
          seg.depart === nextDepart &&
          seg.arrive === nextArrive &&
          seg.isDepartConfirmed === nextIsDepartConfirmed &&
          seg.isArriveConfirmed === nextIsArriveConfirmed;

        return same
          ? seg
          : {
              ...seg,
              depart: nextDepart,
              arrive: nextArrive,
              isDepartConfirmed: nextIsDepartConfirmed,
              isArriveConfirmed: nextIsArriveConfirmed,
            };
      });

      const isSameList =
        prev.length === next.length && prev.every((p, i) => p === next[i]);

      // ✅ 변경: 자동확정 후에도 체인/날짜 보정이 항상 적용되도록
      return isSameList ? prev : normalizeMulti(next);
    });
  }, [
    segments.map((s) => s?.departInput ?? "").join("|"),
    segments.map((s) => s?.arrivalInput ?? "").join("|"),
    setSegments,
  ]);

  /* ===============================
     🔥 바깥 클릭 → 드롭다운 닫기
     =============================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      setSegments((prev) =>
        prev.map((seg) => {
          const wrap = wrapRefs.current[seg.id];
          if (wrap && !wrap.contains(e.target)) {
            if (!seg.showDepartDropdown && !seg.showArriveDropdown) return seg;
            return {
              ...seg,
              showDepartDropdown: false,
              showArriveDropdown: false,
            };
          }
          return seg;
        })
      );
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSegments]);

  /* ===============================
     ✅ 노선 추가 규칙
     - 새 구간 depart는 "직전 구간 arrive"로 자동 세팅
     - 직전 구간 arrive가 확정되지 않았으면 추가 불가
     - 새 구간의 arrive/date는 비워둠
     =============================== */
  const addSegment = () => {
    if (segments.length >= MAX_MULTI_SEGMENTS) return;

    const last = segments[segments.length - 1];
    const lastArrive = last?.arrive ?? null;

    if (!lastArrive || !last?.isArriveConfirmed) {
      toast.error("이전 노선의 도착지를 먼저 확정한 후 노선을 추가하세요");
      return;
    }

    // ✅ 변경: 추가 후에도 체인/날짜 보정이 적용되도록
    setSegments((prev) =>
      normalizeMulti([
        ...prev,
        {
          id: Date.now(),

          // ✅ depart 자동 고정
          departInput: lastArrive.label,
          depart: lastArrive,
          isDepartConfirmed: true,

          // 새 구간은 도착지/날짜만 입력
          arrivalInput: "",
          arrive: null,
          isArriveConfirmed: false,

          date: null,

          showDepartDropdown: false,
          showArriveDropdown: false,
        },
      ])
    );
  };

  /* ===============================
     ✅ 삭제 규칙
     - 삭제 후에도 체인이 깨질 수 있으므로 setSegments 후 체인 보정 필요
     =============================== */
  const removeSegment = (id) => {
    if (segments.length === 1) return;

    // ✅ 변경: 삭제 직후 체인/날짜 보정
    setSegments((prev) => normalizeMulti(prev.filter((seg) => seg.id !== id)));

    delete svgRefs.current[id];
    delete wrapRefs.current[id];
  };

  /* ===============================
     🚫 스왑 비활성화
     =============================== */
  const handleSwap = (id) => {
    toast.info(
      "다구간에서는 경로가 연속되어야 해서 출발/도착 스왑을 지원하지 않습니다."
    );
    return;
  };

  /* ===============================
     🔍 검색
     =============================== */
  const handleSearchClick = () => {
    // 1) 첫 구간 depart 필수
    const first = segments[0];
    if (!first?.isDepartConfirmed || !first?.depart?.iata) {
      toast.error("첫 번째 노선의 출발지를 확정하세요");
      return;
    }

    // 2) 모든 구간 arrive/date 필수
    const invalidIndex = segments.findIndex(
      (seg) => !seg?.isArriveConfirmed || !seg?.arrive?.iata || !seg?.date
    );
    if (invalidIndex !== -1) {
      toast.error(`${invalidIndex + 1}번째 노선의 도착지/날짜를 입력하세요`);
      return;
    }

    // 3) 체인 검증: i>0 depart === prev arrive
    for (let i = 1; i < segments.length; i++) {
      const prevArrive = segments[i - 1]?.arrive?.iata;
      const currDepart = segments[i]?.depart?.iata;

      if (!prevArrive || !currDepart || prevArrive !== currDepart) {
        toast.error(
          `노선 연결이 올바르지 않습니다. (${i}번째 → ${i + 1}번째 연결 확인)`
        );
        return;
      }
    }

    onSearch();
  };

  return (
    <div className="multi-container">
      {segments.map((seg, idx) => {
        const departInput = seg?.departInput ?? "";
        const arrivalInput = seg?.arrivalInput ?? "";

        // 0번 구간만 출발지 드롭다운 사용
        const filteredDepart =
          idx === 0
            ? AIRPORTS.filter((a) =>
                normalize(a.label).includes(normalize(departInput))
              )
            : [];

        // 모든 구간 도착지 드롭다운 사용
        const filteredArrive = AIRPORTS.filter((a) =>
          normalize(a.label).includes(normalize(arrivalInput))
        );

        const isFirst = idx === 0;
        const isLockedDepart = !isFirst; // i>0 출발지 고정

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
                value={departInput}
                placeholder="도시명 또는 공항명"
                readOnly={isLockedDepart}
                onChange={(e) => {
                  if (isLockedDepart) return;

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
                onFocus={() => {
                  if (isLockedDepart) return;
                  if (!seg.isDepartConfirmed && departInput) {
                    setSegments((prev) =>
                      prev.map((s) =>
                        s.id === seg.id ? { ...s, showDepartDropdown: true } : s
                      )
                    );
                  }
                }}
              />

              {isFirst &&
                seg.showDepartDropdown &&
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
              disabled={true}
              title="다구간은 연속 여정이라 스왑 불가"
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
                value={arrivalInput}
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
                onFocus={() => {
                  if (!seg.isArriveConfirmed && arrivalInput) {
                    setSegments((prev) =>
                      prev.map((s) =>
                        s.id === seg.id ? { ...s, showArriveDropdown: true } : s
                      )
                    );
                  }
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
                          // ✅ 변경: 도착지 확정 후 즉시 체인/날짜 보정
                          setSegments((prev) => {
                            const mapped = prev.map((s) =>
                              s.id === seg.id
                                ? {
                                    ...s,
                                    arrivalInput: a.label,
                                    arrive: a,
                                    isArriveConfirmed: true,
                                    showArriveDropdown: false,
                                  }
                                : s
                            );
                            return normalizeMulti(mapped);
                          });
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
              // ✅ 핵심: 클릭된 input DOM을 같이 넘겨야 "바로 아래" 위치로 계산 가능
              onClick={(e) => onOpenCalendar(seg.id, e.currentTarget)}
            >
              <label>가는 편</label>
              <input
                readOnly
                value={
                  seg?.date ? format(seg.date, "yyyy.MM.dd") : "연도 - 월 - 일"
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

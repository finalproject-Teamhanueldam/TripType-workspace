import { useEffect, useRef } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";

import "react-datepicker/dist/react-datepicker.css";
import "../../css/filter/CalendarPanel.css";

/* 🔥 한글 locale 등록 (한 번만) */
registerLocale("ko", ko);

const CalendarPanel = ({
  open,
  onClose,

  tripType, // "ROUND" | "ONEWAY" | "MULTI"
  onTripTypeChange, // ROUND <-> ONEWAY 만 처리

  startDate,
  endDate,
  onChange,

  // ✅ MULTI에서만: 클릭된 날짜 input 바로 아래에 띄우기 위한 inline style
  // (ROUND/ONEWAY는 기존 CSS absolute(top:100%) 그대로 사용)
  style,
}) => {
  const panelRef = useRef(null);

  const isRound = tripType === "ROUND";
  const isMulti = tripType === "MULTI";

  /* ===============================
     🔥 외부 클릭 / ESC 닫기
     =============================== */
  useEffect(() => {
    if (!open) return;

    const handleOutside = (e) => {
      if (!panelRef.current) return;

      // ✅ 패널 내부면 무시
      if (panelRef.current.contains(e.target)) return;

      onClose();
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    // ✅ MULTI에서도 확실히: pointerdown + capture
    document.addEventListener("pointerdown", handleOutside, true);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("pointerdown", handleOutside, true);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);


  if (!open) return null;

  return (
    <div className="calendar-panel" ref={panelRef} style={style}>
      {/* ===============================
          🔹 Header
         =============================== */}
      <div className="calendar-header">
        <div className="calendar-left">
          {/* MULTI일 때는 왕복/편도 전환 숨김 */}
          {!isMulti && (
            <select
              value={tripType}
              onChange={(e) => onTripTypeChange(e.target.value)}
              className="calender-dropbox"
            >
              <option value="ROUND">왕복</option>
              <option value="ONEWAY">편도</option>
            </select>
          )}
        </div>
      </div>

      {/* ===============================
          🔹 Calendar (특정 날짜 전용)
         =============================== */}
      <DatePicker
        inline
        locale="ko"
        monthsShown={2}
        minDate={new Date()}
        showOutsideMonth={false} // ✅ 이게 진짜
        fixedHeight={false} // 🔥 이게 결정타

        /* ROUND만 range */
        selectsRange={isRound}
        startDate={isRound ? startDate : undefined}
        endDate={isRound ? endDate : undefined}

        /* ONEWAY / MULTI는 단일 선택 */
        selected={!isRound ? startDate : undefined}
        onChange={(value) => {
          if (isRound) {
            const [start, end] = value || [];
            onChange(start ?? null, end ?? null);
          } else {
            onChange(value ?? null, null);
          }
        }}
      />

      {/* ===============================
          🔹 Footer
         =============================== */}
      <div className="calendar-footer">
        <button type="button" className="apply-btn" onClick={onClose}>
          적용
        </button>
      </div>
    </div>
  );
};

export default CalendarPanel;

import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../style/filter/CalendarPanel.css";


const CalendarPanel = ({
  open,
  onClose,

  mode = "round", // "round" | "oneway"
  onModeChange,

  startDate,
  endDate,
  onChange,
}) => {
  const panelRef = useRef(null);
  const [dateMode, setDateMode] = useState("specific");

  /* ===============================
     🔥 외부 클릭 / ESC 닫기
     =============================== */
  useEffect(() => {
    if (!open) return;

    const handleOutside = (e) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="calendar-panel" ref={panelRef}>
      {/* ===============================
          🔹 Header
         =============================== */}
      <div className="calendar-header">
        <div className="calendar-left">
          <select
            value={mode}
            onChange={(e) => onModeChange(e.target.value)}
          >
            <option value="round">왕복</option>
            <option value="oneway">편도</option>
          </select>
        </div>

        <div className="calendar-modes">
          <button
            type="button"
            className={dateMode === "specific" ? "active" : ""}
            onClick={() => setDateMode("specific")}
          >
            특정 날짜
          </button>
          <button
            type="button"
            className={dateMode === "flexible" ? "active" : ""}
            onClick={() => setDateMode("flexible")}
          >
            날짜 조정 가능
          </button>
        </div>
      </div>

      {/* ===============================
          🔹 Calendar
         =============================== */}
      {dateMode === "specific" && (
        <DatePicker
          inline
          monthsShown={2}
          minDate={new Date()}

          selectsRange={mode === "round"}
          startDate={mode === "round" ? startDate : undefined}
          endDate={mode === "round" ? endDate : undefined}
          selected={mode === "oneway" ? startDate : undefined}

          onChange={(value) => {
            if (mode === "round") {
              const [start, end] = value || [];
              onChange(start ?? null, end ?? null);
            } else {
              onChange(value ?? null, null);
            }
          }}
        />
      )}

      {dateMode === "flexible" && (
        <div className="month-grid">
          <div className="month-placeholder">
            날짜 조정 가능 UI (다음 단계)
          </div>
        </div>
      )}

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

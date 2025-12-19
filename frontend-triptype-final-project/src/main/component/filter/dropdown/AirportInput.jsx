import { useState, useEffect, useRef } from "react";
import "../../../css/filter/dropdown/AirportInput.css";
import { AIRPORTS } from "../../data/Airports";

const normalize = (v = "") => v.trim().toLowerCase();

const AirportInput = ({
  label,
  value = "",
  onChange,
  onConfirm,
}) => {
  const wrapRef = useRef(null);
  const [open, setOpen] = useState(false);

  /* ===============================
     🔹 확정 여부 판단 (렌더 기준)
     =============================== */
  const isConfirmed = AIRPORTS.some(
    (a) => normalize(a.label) === normalize(value)
  );

  /* ===============================
     🔹 필터링
     =============================== */
  const filtered = value
    ? AIRPORTS.filter((a) =>
        normalize(a.label).includes(normalize(value))
      )
    : [];

  /* ===============================
     🔹 바깥 클릭 닫기
     =============================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="filter-item airport-field" ref={wrapRef}>
      <label>{label}</label>

      <input
        value={value}
        placeholder="도시명 또는 공항명"
        onChange={(e) => {
          const next = e.target.value;
          onChange(next);

          // ✅ next 기준으로 확정 여부 판단 (핵심 수정)
          const confirmedNext = AIRPORTS.some(
            (a) => normalize(a.label) === normalize(next)
          );

          if (next && !confirmedNext) {
            setOpen(true);
          } else {
            setOpen(false);
          }
        }}
        onClick={() => {
          // ✅ 현재 value 기준 판단
          const confirmedNow = AIRPORTS.some(
            (a) => normalize(a.label) === normalize(value)
          );

          if (!confirmedNow && value) {
            setOpen(true);
          }
        }}
      />

      {open && !isConfirmed && filtered.length > 0 && (
        <ul className="airport-dropdown">
          {filtered.map((a) => (
            <li
              key={a.iata}
              onMouseDown={() => {
                onConfirm(a.label); // 🔥 string만 전달
                setOpen(false);
              }}
            >
              {a.label}
              <span className="iata">({a.iata})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AirportInput;

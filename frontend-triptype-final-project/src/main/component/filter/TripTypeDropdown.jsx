import { useState, useRef, useEffect } from "react";
import { FaArrowRight, FaSyncAlt, FaRoute } from "react-icons/fa";
import "../../style/filter/TripTypeDropdown.css";

const TripTypeDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const options = [
    { value: "ONEWAY", label: "편도", icon: <FaArrowRight /> },
    { value: "ROUND", label: "왕복", icon: <FaSyncAlt /> },
    { value: "MULTI", label: "다구간", icon: <FaRoute /> },
  ];

  const current = options.find(o => o.value === value);

  // 🔥 바깥 클릭 닫기
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="triptype-dropdown" ref={ref}>
      <button
        type="button"
        className="triptype-trigger"
        onClick={() => setOpen(v => !v)}
      >
        {current.label}
        <span className="arrow">▾</span>
      </button>

      {open && (
        <ul className="triptype-menu">
          {options.map(opt => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              <span className="icon">{opt.icon}</span>
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TripTypeDropdown;

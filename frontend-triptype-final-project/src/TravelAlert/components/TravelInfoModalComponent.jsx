import { useEffect, useState } from "react";
import "../css/TravelInfoModalComponent.css";

const TravelInfoModalComponent = ({ open, onClose, country, travelInform }) => {
  const [text, setText] = useState(null);

  useEffect(() => {
    if (!country || !travelInform) return;

    const iso = country.country_iso_alp2;
    const info = travelInform[iso];

    if (info) {
      setText(info);
    }
  }, [country, travelInform]);

  if (!open || !country) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <h2>{country.country_nm}</h2>
        <p>{country.country_eng_nm}</p>
        <p>대륙 : {country.continent_nm}</p>
        <p>경보단계 : {country.alertLevel}</p>

        <p>주요내용</p>
        <div className="modal-text-area">
          {text?.levels?.map((t, idx) => (
            <p key={idx}>{t}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelInfoModalComponent;

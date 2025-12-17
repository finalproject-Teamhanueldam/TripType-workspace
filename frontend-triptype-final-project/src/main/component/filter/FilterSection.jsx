import { useState } from "react";
import "../../style/filter/FilterSection.css";

import TripFilterContainer from "./TripFilterContainer";

const FilterSection = () => {
  const [depart, setDepart] = useState("");
  const [arrive, setArrive] = useState("");

  const handleSwap = () => {
    if (!depart || !arrive) return;

    setDepart((prevDepart) => {
      setArrive(prevDepart);
      return arrive;
    });
  };

  return (
    <div className="filter-container">
      <TripFilterContainer
        depart={depart}
        arrive={arrive}
        setDepart={setDepart}
        setArrive={setArrive}
        onSwap={handleSwap}
      />
    </div>
  );
};

export default FilterSection;

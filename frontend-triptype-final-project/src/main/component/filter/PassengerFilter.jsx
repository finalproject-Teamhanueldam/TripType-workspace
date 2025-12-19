import { useEffect, useRef } from "react";
import "../../css/filter/PassengerFilter.css";

const PassengerFilter = ({ passengers, setPassengers, onClose }) => {
  const panelRef = useRef(null);

  /* ===============================
     🔑 상한선 규칙
     =============================== */
  const MAX_ADULT = 8;
  const MAX_CHILD = 8;
  const MAX_TOTAL = 16;

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  /* ===============================
     🔼 증가 (상한선 적용)
     =============================== */
  const increase = (type) => {
    setPassengers((prev) => {
      const total = prev.adult + prev.child;

      // 총 인원 제한
      if (total >= MAX_TOTAL) return prev;

      // 성인 상한
      if (type === "adult" && prev.adult >= MAX_ADULT) return prev;

      // 유/소아 상한 + 성인 초과 방지
      if (type === "child") {
        if (prev.child >= MAX_CHILD) return prev;
        if (prev.child + 1 > prev.adult) return prev;
      }

      return {
        ...prev,
        [type]: prev[type] + 1,
      };
    });
  };

  /* ===============================
     🔽 감소 (하한선 적용)
     =============================== */
  const decrease = (type) => {
    setPassengers((prev) => {
      // 성인은 최소 1
      if (type === "adult" && prev.adult === 1) return prev;

      // 0 이하 방지
      if (prev[type] === 0) return prev;

      // 성인 감소 시 유/소아가 더 많아지면 차단
      if (type === "adult" && prev.child > prev.adult - 1) return prev;

      return {
        ...prev,
        [type]: prev[type] - 1,
      };
    });
  };

  const total = passengers.adult + passengers.child;

  return (
    <div
      className="passenger-filter"
      ref={panelRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="passenger-header">
        <h4>좌석 등급</h4>
        <p className="desc">
          검색하신 노선은 일반석 가격만 보여드릴 수 있습니다.
        </p>
      </div>

      <div className="passenger-panel">
        <div className="row">
          <div className="label">
            <strong>성인</strong>&nbsp;&nbsp;
            <span>18세 이상</span>
          </div>
          <div className="counter">
            <button type="button" onClick={() => decrease("adult")}>−</button>
            <span>{passengers.adult}</span>
            <button type="button" onClick={() => increase("adult")}>+</button>
          </div>
        </div>

        <div className="row">
          <div className="label">
            <strong>유/소아</strong>&nbsp;&nbsp;
            <span>0~17세</span>
          </div>
          <div className="counter">
            <button type="button" onClick={() => decrease("child")}>−</button>
            <span>{passengers.child}</span>
            <button type="button" onClick={() => increase("child")}>+</button>
          </div>
        </div>

        <div className="passenger-note">
          총 좌석 수: {total}석
        </div>
      </div>

      <div className="passenger-footer">
        <button type="button" className="apply-btn" onClick={onClose}>
          적용
        </button>
      </div>
    </div>
  );
};

export default PassengerFilter;

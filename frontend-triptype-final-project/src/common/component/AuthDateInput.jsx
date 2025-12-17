import React from "react";

const AuthDateInput = React.forwardRef(({ value, onClick }, ref) => (
  <button
    type="button"
    className={`auth-date-input ${value ? "has-value" : "is-placeholder"}`}
    onClick={onClick}
    ref={ref}
  >
    {value || "날짜 선택"}
  </button>
));

export default AuthDateInput;
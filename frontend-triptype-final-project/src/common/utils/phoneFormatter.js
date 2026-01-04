// 숫자 → 010-XXXX-XXXX
export const formatPhone = (value) => {
  if (!value) return "";
  const onlyNum = value.replace(/\D/g, "");

  if (onlyNum.length === 11) {
    return onlyNum.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }
  return value;
};

// 010-XXXX-XXXX → 숫자만
export const unformatPhone = (value) => {
  return value ? value.replace(/\D/g, "") : "";
};
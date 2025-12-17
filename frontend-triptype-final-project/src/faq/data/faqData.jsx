export const FaqData = [
  // ================= 예약 =================
  {
    id: 1,
    category: "RESERVE",
    question: "항공권은 출발 몇 개월 전부터 예약할 수 있나요?",
    answer: "일반적으로 출발일 기준 약 10~12개월 전부터 예약이 가능합니다."
  },
  {
    id: 2,
    category: "RESERVE",
    question: "여러 명의 항공권을 한 번에 예약할 수 있나요?",
    answer: "동일 일정 기준 최대 인원 제한 내에서 단체 예약이 가능합니다."
  },
  {
    id: 3,
    category: "RESERVE",
    question: "유아 또는 소아 항공권도 예약할 수 있나요?",
    answer: "유아 및 소아 항공권은 성인과 함께 예약해야 합니다."
  },
  {
    id: 4,
    category: "RESERVE",
    question: "좌석 지정은 언제 할 수 있나요?",
    answer: "항공사 정책에 따라 예약 시 또는 체크인 시 가능합니다."
  },
  {
    id: 5,
    category: "RESERVE",
    question: "경유 항공권도 검색할 수 있나요?",
    answer: "직항 및 경유 항공편 모두 검색 가능합니다."
  },
  {
    id: 6,
    category: "RESERVE",
    question: "예약 완료 후 이메일을 받지 못했어요.",
    answer: "스팸함을 확인하거나 고객센터로 문의해 주세요."
  },
  {
    id: 7,
    category: "RESERVE",
    question: "항공권 가격은 언제 확정되나요?",
    answer: "결제가 완료된 시점에 가격이 확정됩니다."
  },
  {
    id: 8,
    category: "RESERVE",
    question: "다구간 항공권도 예약 가능한가요?",
    answer: "다구간 일정 검색 및 예약을 지원합니다."
  },
  {
    id: 9,
    category: "RESERVE",
    question: "특가 항공권은 환불이 가능한가요?",
    answer: "특가 항공권은 환불이 제한될 수 있습니다."
  },
  {
    id: 10,
    category: "RESERVE",
    question: "예약 후 이름 변경이 가능한가요?",
    answer: "경미한 오타만 수정 가능하며 전체 변경은 제한됩니다."
  },

  // ================= 결제 =================
  {
  id: 101,
  category: "PAY",
  question: "결제 가능한 카드 종류는 무엇인가요?",
  answer: "국내외 신용카드 및 체크카드 결제가 가능하며, 일부 해외 항공사는 해외 결제 전용 카드만 지원할 수 있습니다."
},
{
  id: 102,
  category: "PAY",
  question: "결제 후 바로 예약이 확정되나요?",
  answer: "대부분의 항공권은 결제 완료 후 즉시 예약이 확정되지만, 항공사 사정에 따라 승인 대기 상태가 발생할 수 있습니다."
},
{
  id: 103,
  category: "PAY",
  question: "결제 오류가 발생했는데 금액이 청구된 것처럼 보여요.",
  answer: "일시적인 승인 보류 상태일 수 있으며, 실제 결제가 아닌 경우 자동으로 취소 처리됩니다."
},
{
  id: 104,
  category: "PAY",
  question: "간편결제도 사용할 수 있나요?",
  answer: "카카오페이, 네이버페이 등 간편결제를 지원하며, 항공사별로 지원 여부가 다를 수 있습니다."
},
{
  id: 105,
  category: "PAY",
  question: "해외 결제 수수료가 발생하나요?",
  answer: "해외 항공사 결제 시 카드사 정책에 따라 해외 결제 수수료가 부과될 수 있습니다."
},
{
  id: 106,
  category: "PAY",
  question: "할부 결제가 가능한가요?",
  answer: "일부 카드사에 한해 할부 결제가 가능하며, 항공사 및 카드사 정책에 따라 제한될 수 있습니다."
},
{
  id: 107,
  category: "PAY",
  question: "결제 영수증은 어디서 확인하나요?",
  answer: "예약 완료 후 마이페이지 또는 결제 완료 이메일을 통해 확인할 수 있습니다."
},
{
  id: 108,
  category: "PAY",
  question: "법인카드로도 결제가 가능한가요?",
  answer: "일반 신용카드와 동일하게 법인카드 결제가 가능합니다."
},
{
  id: 109,
  category: "PAY",
  question: "결제 통화는 어떻게 되나요?",
  answer: "기본적으로 원화(KRW) 결제가 제공되며, 일부 항공사는 외화 결제로 진행될 수 있습니다."
},
{
  id: 110,
  category: "PAY",
  question: "결제 후 가격이 달라졌어요.",
  answer: "항공권 가격은 실시간 변동되며, 결제 단계에서 최종 가격이 확정됩니다."
},  


  // ================= 변경/환불 =================
  {
  id: 201,
  category: "CHANGE",
  question: "항공권 일정 변경이 가능한가요?",
  answer: "항공사 및 예약한 요금 규정에 따라 변경 가능 여부와 수수료가 달라집니다."
},
{
  id: 202,
  category: "CHANGE",
  question: "출발 날짜를 변경하면 추가 요금이 발생하나요?",
  answer: "변경 시점의 항공권 가격 차액 및 변경 수수료가 부과될 수 있습니다."
},
{
  id: 203,
  category: "CHANGE",
  question: "환불 수수료는 얼마인가요?",
  answer: "환불 수수료는 항공사 및 요금 규정에 따라 다르며, 일부 특가 항공권은 환불이 불가할 수 있습니다."
},
{
  id: 204,
  category: "CHANGE",
  question: "환불 요청은 어디서 하나요?",
  answer: "마이페이지 내 예약 상세 화면에서 환불 요청이 가능합니다."
},
{
  id: 205,
  category: "CHANGE",
  question: "환불 완료까지 얼마나 걸리나요?",
  answer: "환불 승인 후 영업일 기준 약 5~10일 정도 소요됩니다."
},
{
  id: 206,
  category: "CHANGE",
  question: "부분 환불도 가능한가요?",
  answer: "일부 항공권은 구간 또는 승객 단위 부분 환불이 가능하지만 제한될 수 있습니다."
},
{
  id: 207,
  category: "CHANGE",
  question: "노쇼(No-show) 시 환불이 되나요?",
  answer: "출발 후 노쇼 처리된 항공권은 환불이 불가하거나 제한될 수 있습니다."
},
{
  id: 208,
  category: "CHANGE",
  question: "항공권 이름 변경이 가능한가요?",
  answer: "보안상의 이유로 대부분의 항공권은 탑승객 이름 변경이 불가능합니다."
},
{
  id: 209,
  category: "CHANGE",
  question: "항공사 취소 시 환불은 어떻게 되나요?",
  answer: "항공사 사유로 취소된 경우 전액 환불 또는 대체 항공편이 제공됩니다."
},
{
  id: 210,
  category: "CHANGE",
  question: "변경/환불 진행 상태는 어디서 확인하나요?",
  answer: "마이페이지에서 변경·환불 처리 상태를 실시간으로 확인할 수 있습니다."
},


  // ================= 기타 =================
 {
  id: 301,
  category: "ETC",
  question: "항공권 가격은 왜 자주 변동되나요?",
  answer: "좌석 수요, 잔여 좌석 수, 항공사 정책에 따라 실시간으로 가격이 변동됩니다."
},
{
  id: 302,
  category: "ETC",
  question: "여권 정보는 언제 입력해야 하나요?",
  answer: "대부분 예약 시 또는 출발 전까지 여권 정보 입력이 필요합니다."
},
{
  id: 303,
  category: "ETC",
  question: "비자 정보도 입력해야 하나요?",
  answer: "국가 및 노선에 따라 비자가 필요할 수 있으며, 비자 발급 여부는 이용자 책임입니다."
},
{
  id: 304,
  category: "ETC",
  question: "수하물 규정은 어디서 확인하나요?",
  answer: "항공사 및 요금 유형에 따라 무료 수하물 규정이 다르며 예약 상세 페이지에서 확인할 수 있습니다."
},
{
  id: 305,
  category: "ETC",
  question: "좌석 지정은 언제 하나요?",
  answer: "예약 후 또는 체크인 시 좌석 지정이 가능하며 일부 항공사는 유료일 수 있습니다."
},
{
  id: 306,
  category: "ETC",
  question: "기내식은 제공되나요?",
  answer: "항공사 및 노선에 따라 기내식 제공 여부가 다르며, 일부 저가 항공사는 별도 구매가 필요합니다."
},
{
  id: 307,
  category: "ETC",
  question: "항공권 예약 확인서는 어디서 받나요?",
  answer: "예약 완료 후 이메일 및 마이페이지에서 예약 확인서를 확인할 수 있습니다."
},
{
  id: 308,
  category: "ETC",
  question: "모바일 탑승권 사용이 가능한가요?",
  answer: "대부분의 항공사는 모바일 탑승권 사용을 지원합니다."
},
{
  id: 309,
  category: "ETC",
  question: "출발 당일 공항에는 언제 도착해야 하나요?",
  answer: "국내선은 최소 1시간, 국제선은 최소 2~3시간 전 도착을 권장합니다."
},
{
  id: 310,
  category: "ETC",
  question: "항공편 지연 시 알림을 받을 수 있나요?",
  answer: "항공편 지연 및 변경 사항은 문자 또는 이메일로 안내됩니다."
}

];

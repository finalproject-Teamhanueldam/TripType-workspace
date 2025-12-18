import { useState } from "react";

const TestAmadeus = () => {
  const [loading, setLoading] = useState(false);

  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");
  const [goDate, setGoDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // 조회한 전체 항공권 저장
  const [allOffers, setAllOffers] = useState([]);

  // 선택된 항공권의 경유편 목록
  const [transitSegments, setTransitSegments] = useState([]);

  // 항공사명 매핑 테이블
  const airlineNames = {
    KE: "대한항공",
    OZ: "아시아나항공",
    DL: "델타항공",
    UA: "유나이티드항공",
    AA: "아메리칸항공",
    NH: "전일본공수",
    JL: "일본항공",
    SQ: "싱가포르항공",
    TR: "Scoot",
  };

  // Access Token 발급
  const getAccessToken = async () => {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", "fLCLHvWxpvmGyvdGuWuiMh0wInbpGsRZ");
    params.append("client_secret", "LPOiGWiCoR8ghPLb");

    const response = await fetch(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      }
    );

    const data = await response.json();
    return data.access_token;
  };

  // 경유 구간 추출 함수
  const extractTransit = (offer) => {
    const seg = offer.itineraries[0].segments;
    if (seg.length <= 1) return []; // 직항이면 경유 없음

    return seg.map((s, idx) => ({
      경유번호: idx + 1,
      판매항공사: s.carrierCode,
      운항항공사: s.operating?.carrierCode ?? "",
      편명: s.number,
      출발공항: s.departure.iataCode,
      출발시간: s.departure.at,
      도착공항: s.arrival.iataCode,
      도착시간: s.arrival.at,
      비행시간: s.duration,
    }));
  };

  // 항공권 요약 전처리
  const parseFlightData = (json) => {
    if (!json.data) return [];

    return json.data.map((offer, idx) => {
      const itineraries = offer.itineraries;
      const airlineCode = offer.validatingAirlineCodes?.[0] ?? "";
      const airlineName = airlineNames[airlineCode] || airlineCode;

      const firstItin = itineraries[0];
      const seg0 = firstItin.segments;
      const go_first = seg0[0];
      const go_last = seg0[seg0.length - 1];

      let return_first = {};
      let return_last = {};
      let inboundDuration = "";
      let inboundStops = "";

      const isRoundTrip = itineraries.length > 1;

      if (isRoundTrip) {
        const secondItin = itineraries[1];
        const seg1 = secondItin.segments;
        return_first = seg1[0];
        return_last = seg1[seg1.length - 1];
        inboundDuration = secondItin.duration;
        inboundStops = seg1.length - 1;
      }

      const wayType = offer.oneWay ? "편도" : "왕복";

      return {
        raw: offer, // 경유편 조회 용으로 원본 저장

        "항공권ID": idx + 1,
        "항공사": airlineName,
        "총요금": offer.price?.total ?? "",
        "편도/왕복": wayType,

        // 가는편
        "가는_출발공항": go_first.departure.iataCode,
        "가는_출발시간": go_first.departure.at,
        "가는_도착공항": go_last.arrival.iataCode,
        "가는_도착시간": go_last.arrival.at,
        "가는_소요시간": firstItin.duration,
        "가는_경유수": seg0.length - 1,

        // 오는편
        "오는_출발공항": isRoundTrip ? return_first.departure.iataCode : "",
        "오는_출발시간": isRoundTrip ? return_first.departure.at : "",
        "오는_도착공항": isRoundTrip ? return_last.arrival.iataCode : "",
        "오는_도착시간": isRoundTrip ? return_last.arrival.at : "",
        "오는_소요시간": isRoundTrip ? inboundDuration : "",
        "오는_경유수": isRoundTrip ? inboundStops : "",

        "검색_가는날": goDate,
        "검색_오는날": returnDate || "",
      };
    });
  };

  // 엑셀 내보내기
  const exportToExcel = (rows) => {
    const XLSX = window.XLSX;

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "항공편_요약");
    XLSX.writeFile(wb, "항공편_요약.xlsx");
  };

  // 경유편 조회 버튼 핸들러
  const handleTransitView = (offer) => {
    const list = extractTransit(offer.raw);
    setTransitSegments(list);
  };

  // API 호출
  const getFlightOffers = async () => {
    if (!origin || !dest || !goDate) {
      alert("출발공항/도착공항/가는날을 입력해야 합니다.");
      return;
    }

    setLoading(true);

    try {
      const token = await getAccessToken();

      let url =
        "https://test.api.amadeus.com/v2/shopping/flight-offers?" +
        `originLocationCode=${origin}` +
        `&destinationLocationCode=${dest}` +
        `&departureDate=${goDate}` +
        `&adults=1`;

      if (returnDate) {
        url += `&returnDate=${returnDate}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await response.json();
      const parsed = parseFlightData(json);

      setAllOffers(parsed); // 화면에서 사용할 전체 항공권 저장
      exportToExcel(parsed);

    } catch (err) {
      console.error("API 오류:", err);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", width: "350px", display: "flex", flexDirection: "column", gap: "12px" }}>

      {/* 입력 UI */}
      <input
        placeholder="출발공항 예: ICN"
        value={origin}
        onChange={(e) => setOrigin(e.target.value.toUpperCase())}
      />

      <input
        placeholder="도착공항 예: LAX"
        value={dest}
        onChange={(e) => setDest(e.target.value.toUpperCase())}
      />

      <label>가는날</label>
      <input type="date" value={goDate} onChange={(e) => setGoDate(e.target.value)} />

      <label>오는날 (선택)</label>
      <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />

      <button onClick={getFlightOffers} disabled={loading}>
        {loading ? "불러오는 중..." : "항공편 요약 엑셀 다운로드"}
      </button>

      {/* 조회된 항공권 리스트 */}
      {allOffers.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>조회된 항공권 목록</h3>
          {allOffers.map((item) => (
            <div
              key={item["항공권ID"]}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <div>항공권ID: {item["항공권ID"]}</div>
              <div>항공사: {item["항공사"]}</div>
              <div>총요금: {item["총요금"]}</div>
              <div>편도/왕복: {item["편도/왕복"]}</div>

              <button
                style={{ marginTop: "8px" }}
                onClick={() => handleTransitView(item)}
              >
                경유편 조회
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 경유편 결과 표시 */}
      {transitSegments.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>선택 항공권의 경유편</h3>
          {transitSegments.map((t, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#fafafa",
              }}
            >
              <div>경유번호: {t.경유번호}</div>
              <div>판매항공사: {t.판매항공사}</div>
              <div>운항항공사: {t.운항항공사}</div>
              <div>편명: {t.편명}</div>
              <div>
                출발: {t.출발공항} ({t.출발시간})
              </div>
              <div>
                도착: {t.도착공항} ({t.도착시간})
              </div>
              <div>비행시간: {t.비행시간}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestAmadeus;

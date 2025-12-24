const tripList = [
  {
    tripId: 1,
    type: "ONE",
    totalPrice: 650000,
    currency: "KRW",

    segments: [
      {
        segmentNo: 1,
        airline: {
          code: "OZ",
          name: "아시아나항공",
          logoUrl: "/airlines/OZ.png",
        },
        flightNumber: "OZ102",
        departure: {
          airportCode: "ICN",
          city: "인천",
          time: "2025-12-16T09:20",
        },
        arrival: {
          airportCode: "NRT",
          city: "도쿄",
          time: "2025-12-16T11:45",
        },
        duration: 145,
        cabinClass: "ECONOMY",
      }
    ],
  },

  {
    tripId: 2,
    type: "TRANSIT",
    totalPrice: 812000,
    currency: "KRW",

    segments: [
      {
        segmentNo: 1,
        airline: {
          code: "OZ",
          name: "아시아나항공",
          logoUrl: "/airlines/OZ.png",
        },
        flightNumber: "OZ102",
        departure: {
          airportCode: "ICN",
          city: "인천",
          time: "2025-12-16T09:20",
        },
        arrival: {
          airportCode: "NRT",
          city: "도쿄",
          time: "2025-12-16T11:45",
        },
        duration: 145,
      },
      {
        segmentNo: 2,
        airline: {
          code: "JL",
          name: "일본항공",
          logoUrl: "/airlines/JL.png",
        },
        flightNumber: "JL742",
        departure: {
          airportCode: "NRT",
          city: "도쿄",
          time: "2025-12-16T13:10",
        },
        arrival: {
          airportCode: "BKK",
          city: "방콕",
          time: "2025-12-16T17:50",
        },
        duration: 340,
      }
    ],
  },

  {
    tripId: 3,
    type: "TRANSIT",
    totalPrice: 790000,
    currency: "KRW",

    segments: [
      {
        segmentNo: 1,
        airline: {
          code: "KE",
          name: "대한항공",
          logoUrl: "/airlines/KE.png",
        },
        flightNumber: "KE659",
        departure: {
          airportCode: "ICN",
          city: "인천",
          time: "2025-12-16T10:40",
        },
        arrival: {
          airportCode: "SGN",
          city: "호치민",
          time: "2025-12-16T14:20",
        },
        duration: 340,
      },
      {
        segmentNo: 2,
        airline: {
          code: "VN",
          name: "베트남항공",
          logoUrl: "/airlines/VN.png",
        },
        flightNumber: "VN451",
        departure: {
          airportCode: "SGN",
          city: "호치민",
          time: "2025-12-16T16:00",
        },
        arrival: {
          airportCode: "DAD",
          city: "다낭",
          time: "2025-12-16T17:30",
        },
        duration: 90,
      }
    ],
  },
];


export default tripList;
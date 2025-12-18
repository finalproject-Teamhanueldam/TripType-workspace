import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";


// 경보단계, 국가명, 등, 국가 정보가  담긴 travel 배열
const MapDataLayerComponent = ({ travel }) => {
  

  // useMap 훅은 Map이 생성한 실제 구글맵 인스턴스를 가져오기 위한 훅
  // useMap() 그 안에 생성된 google.maps.Map 인스턴스에 접근
  const map = useMap();

  useEffect(() => {

    // travel 배열의 길이가 0 혹은 지도 객체를 불러오지 못한 경우 return
    if (!map || travel.length === 0) return;

    // geoJson 데이터를 불러온다.
    // 지도에 스타일링이 가능해진다
    map.data.loadGeoJson("/countries.geojson");

    // feature = "각 국가별"로 스타일 지정
    map.data.setStyle((feature) => {

      // 해당 나라의 ISO_A2 코드를 iso에 저장
      const iso = feature.getProperty("ISO_A2");


      
        // 내가 정제한 ISO 코드와 geoJSON의 iso 코드가 일치한 국가
        const country = travel.find(
            (item) => item.country_iso_alp2 === iso
        );



        // 존재하지 않을 경우 (하얀식 계열)
        if (!country) {
            return {
            fillColor: "#E5E7EB",
            fillOpacity: 0.4,
            strokeWeight: 0.5,
            };
        }

        // 경보단계 1단계 / 2단계 / 3단계 / 4단계
        const colors = {
            1: "#2563eb",
            2: "#f59e0b",
            3: "#ef4444",
            4: "#141212",
        };

        // 스타일링
        return {
            fillColor: colors[country.alertLevel],
            fillOpacity: 0.7,
            strokeWeight: 0.8,
        };
    });

    // 지도 정보 혹은 여행 경보나 정보가 바뀐 경우 useEffect 재-렌더링
  }, [map, travel]);

  // 화면 렌더링 X
  // 이 컴포넌트는 지도에 스타일링만 적용함
  return null;
};

export default MapDataLayerComponent;

import { useEffect } from "react";
import "../css/WorldMapComponent.css";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";

const API_KEY = globalThis.GOOGLE_MAPS_API_KEY ?? "AIzaSyAp-znnFnbjRg0oVxxSYBC6OtuasA42KzQ";

const WorldMapComponent = ({travel}) => {
  console.log(travel);

  // 컴포넌트가 내부에서 생성한 GoogleMap 객체를 가져온다.
  const map = useMap();

  useEffect(() => {
    if(!map && travel.length == 0) return;

    // GeoJson 코드
    map.data.loadGeoJson("../countries.geojson");

    // 국가별 스타일 지정
    map.data.setStyle((feature) => {
      const iso = feature.getProperty("ISO_A2");
      const country = travel.find((item) => item.country_iso.alp2 == iso);

      // 국가가 없는 경우
      if(!country) {
        return { fillColor: "#E5E7EB", fillOpacity: 0.4 };
      }
    });



  }, [map]);

  return (
    <APIProvider
      solutionChannel="GMP_devsite_samples_v3_rgmbasicmap"
      apiKey={API_KEY}
    >
      <div className="map-container">
        <Map
          defaultZoom={3}
          defaultCenter={{ lat: 20, lng: 0 }}
          gestureHandling="greedy"
          disableDefaultUI={false}
        />
      </div>
    </APIProvider>
  );
};




export default WorldMapComponent;
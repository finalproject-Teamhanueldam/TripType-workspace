import "../css/WorldMapComponent.css";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import MapDataLayerComponent from "./MapDataLayerComponent";


const API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

const WorldMapComponent = ({travel}) => {

  return (
    <APIProvider
      solutionChannel="GMP_devsite_samples_v3_rgmbasicmap"
      apiKey={API_KEY}
    >
      <div className="map-container">
        {/* google.maps.Map 생성 */}
        <Map
          defaultZoom={3}
          defaultCenter={{ lat: 20, lng: 0 }}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          <MapDataLayerComponent travel={travel} />
        </Map>
      </div>
    </APIProvider>
  );
};




export default WorldMapComponent;
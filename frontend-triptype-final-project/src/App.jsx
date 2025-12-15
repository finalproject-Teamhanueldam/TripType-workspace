import { Routes, Route } from "react-router-dom";

import AuthStatisticsComponent from "./admin/statistics/component/AuthStatisticsComponent";
import AirlineTicketComponent from "./admin/airlineticket/componnent/AirlineTicketComponent";
function App() {

  return (
    <div>
      <Routes>
        <Route path="/admin/statistics" element={ <AuthStatisticsComponent/> }/>
        <Route path="/admin/airlineticket" element= { <AirlineTicketComponent />}/>
      </Routes>
    </div>
  )
}

export default App

import LoginChartComponent from "./LoginChartComponent";
import MonthlySignupChartComponent from "./MonthlySignupChartComponent";
// import TopRatingAirlineComponent from "./TopRatingAirlineComponent";
import TopReviewAirlineComponent from "./TopReviewAirlineComponent";
import TopSearchedDestinationComponent from "./TopSearChedDestinationComponent";

import "../css/AuthStatistics.css";


const AuthStatisticsComponent = () => {
    
    

    return (
        <div className="wrap">       
            <div className="statistics-content">
                <h2 className ="statistics-title"> 통계 </h2>

                <div className ="statistics-area" >
                    {/* <div className = "statistics-box">< TopRatingAirlineComponent /></div> */}
                    <div className = "statistics-box">< TopReviewAirlineComponent /></div>
                    <div className = "statistics-box">< TopSearchedDestinationComponent /></div>
                </div>

                <div className ="statistics-area" >
                    <div className = "statistics-box">< MonthlySignupChartComponent /></div>
                    <div className = "statistics-box">< LoginChartComponent /></div>
      
                    
                </div>

            </div>

        </div>

    );

}; 
export default AuthStatisticsComponent;
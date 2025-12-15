import {Chart} from "react-google-charts";

const TopRatingAirlineComponent = () => {

    const data = [
        ["항공사 명", "평균 평점"],
        ["아시아나", 5],
        ["대한항공", 4.8],
        ["Tway", 4.6],
        ["진에어", 4.2],
        ["에어부산", 4.2],
    ];
    
    const options = {
        title : "평점 높은 항공사"
    }

    return (
        <div>
            <Chart 
                chartType="BarChart"
                data = {data}
                options = {options}
                width = "400px"
                height = "300px"
            />

        </div>

    );

};

export default TopRatingAirlineComponent;
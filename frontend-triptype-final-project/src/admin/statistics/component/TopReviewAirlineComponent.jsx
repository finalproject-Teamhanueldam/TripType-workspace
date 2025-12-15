import { Chart } from "react-google-charts";

const TopReviewAirlineComponent = () => {

    const data = [
        ["항공사 명", "리뷰 수"],
        ["젯스타 재팬", 4502],
        ["일본 항공", 2040],
        ["아시아나", 1956],
        ["제주항공", 1524],
        ["대한항공", 1222],
    ];   

    const options = {
        title : "리뷰 많은 항공사"
    }

    return(
        <div>
            <Chart 
                chartType="BarChart"
                data= {data}
                options = {options}
                width = "400px"
                height = "300px"
            />

        </div>
    );

};

export default TopReviewAirlineComponent;
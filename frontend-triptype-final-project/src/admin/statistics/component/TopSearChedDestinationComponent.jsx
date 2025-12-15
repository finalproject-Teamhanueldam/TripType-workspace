import { Chart } from "react-google-charts";

const TopSearchedDestinationComponent = () => {

    const data = [
        ["도시 명", "검색 량"],
        ["도쿄", 16120],
        ["삿포로", 15552],
        ["다낭", 10300],
        ["나트랑", 6464],
        ["오사카", 2551],

    ];
    
    const options ={
        title : " 검색 많은 여행지 Top5",
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

export default TopSearchedDestinationComponent;
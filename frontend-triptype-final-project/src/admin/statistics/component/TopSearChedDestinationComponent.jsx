import { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";

const TopSearchedDestinationComponent = () => {

    const [routes, setRoutes] = useState([]);
    const [loading, setloading] = useState(true);

    const data = [
        ["도시 명", "검색 량"],
        routes.map(route => [
            `$(route.departIata) → $(route.arriveIata) `, route.searchCount

        ])

    ];
    
    const options ={
        title : "인기 노선(검색량 기준) Top5",
        hAxis: { title: "검색량" },
        vAxis: { title: "노선" }
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
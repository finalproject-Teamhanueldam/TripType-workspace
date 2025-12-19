import { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";

const TopSearchedDestinationComponent = () => {

    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopularRoutes = async () => {
            
            const url = "http://localhost:8001/triptype/admin/statistics/popular-routes";
            const method = "get";
            
            try {
                const response = await axios.get(url);
                setRoutes(response.data);

                } catch (error) {

                console.error("통계 조회 실패", error);

                } finally {
                    
                setLoading(false);
                }

    };

    fetchPopularRoutes();
}, []);

    if (!routes || routes.length === 0) return <div>데이터 없음</div>;

    const data = [
        ["노선 명", "검색 량"],
        ...routes.map(route => [
            `${route.departIata} → ${route.arriveIata}`, Number(route.searchCount)
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
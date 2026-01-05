import { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";

const TopSearchedDestinationComponent = () => {

    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchPopularRoutes = async () => {
            
            const url = `${API_BASE_URL}/admin/statistics/popular-routes`;
           
            
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

    if (!routes || routes.length === 0) return <div style={{width : "400px"}}>데이터를 조회할 수 없습니다. </div>;

    const data = [
        ["노선 명", "검색 량"],
        ...routes.map(route => [
            `${route.departIata} → ${route.arriveIata}`, Number(route.searchCount)
            ])

    ];
    
    const options ={
        title : "인기 노선(검색량 기준) Top5",
        hAxis: { title: "검색량" },

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
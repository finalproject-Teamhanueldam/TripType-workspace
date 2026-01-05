import {Chart} from "react-google-charts";
import { useEffect, useState } from "react";
import axios from "axios";


const TopRatingAirlineComponent = () => {

    const [topRating, setTopRatings] = useState([]);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchTopRatingAirline = async () => {

            const url = `${API_BASE_URL}/admin/statistics/topratingairline`;

             try {
                const response = await axios.get(url);
                setTopRatings(response.data);

                } catch (error) {

                console.error("통계 조회 실패", error);

                } 
            }
        fetchTopRatingAirline();
    }, []);

    if (!topRating || topRating.length === 0) return <div style={{width : "400px"}}>데이터 없음</div>;

    const data = [
        ["항공사", "평균 평점"],
        ...topRating.map(topRating => [
            topRating.airlineName, Number(topRating.averageReviewRating),
        ])
    ];
    const options = {
        title : "평점 높은 항공사",
        hAxis: {
            minValue: 0,
            maxValue: 5,
            ticks: [0, 1, 2, 3, 4, 5]
        }
    };

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
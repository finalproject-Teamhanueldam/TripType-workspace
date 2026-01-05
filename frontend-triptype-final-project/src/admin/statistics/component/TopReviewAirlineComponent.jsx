import { Chart } from "react-google-charts";
import { useEffect, useState } from "react";
import axios from "axios";

const TopReviewAirlineComponent = () => {

    const [topReview, setTopReviews] = useState([]);
    
    useEffect(() => {
        const fetchTopReviewAirline = async () => {

            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

            const url = `${API_BASE_URL}/admin/statistics/topreviewairline`;

             try {
                const response = await axios.get(url);
                setTopReviews(response.data);

                } catch (error) {

                console.error("통계 조회 실패", error);

                } 
            }
        fetchTopReviewAirline();
    }, []);

    if (!topReview || topReview.length === 0) return <div style={{width : "400px"}}>데이터 없음</div>;

    const data = [
        ["항공사", "리뷰 수"],
        ...topReview.map(topReview => [
            topReview.airlineName, Number(topReview.reviewCount),
        ])
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
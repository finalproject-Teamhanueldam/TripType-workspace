
import { Chart } from "react-google-charts";
import { useEffect, useState } from "react";
import axios from "axios";

const MonthlySignupChartComponent = () => {

    const [monthlySignUp, setMonthlySignUp] = useState([]);  

    useEffect(() => {    

        const fetchMonthlySignUp = async () => {
            try {
                const response = await axios.get("http://localhost:8001/triptype/admin/statistics/monthlysignup");    
                setMonthlySignUp(response.data);

            } catch (error) {
                console.error("월별 가입자/탈퇴자 수 조회 실패", error);
            }

        };

        fetchMonthlySignUp();  

    }, []);

    if (!monthlySignUp) {
        return <div>데이터 없음</div>;
    }
    

    const data = [
        ["월", "가입자 수", "탈퇴자 수"],
        ...monthlySignUp.map(item => [
            item.month,
            item.joinCount,
            item.withdrawCount
        ])
    ];

    const options = {
        title : "월별 가입자/탈퇴자 수"
    }

    return (
        <div>
            <Chart
                chartType="ColumnChart"
                data = {data}
                options = {options}
                width="800px"
                height="450px"
            />

        </div>

        );


};

export default MonthlySignupChartComponent;
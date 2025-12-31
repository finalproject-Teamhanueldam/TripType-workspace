import { Chart } from "react-google-charts";
import { useEffect, useState } from "react";
import axios from "axios";

const LoginChartComponent = () => {
        const [loginData, setLoginData] = useState(null);     

        useEffect(() => {
            const fetchLoginData = async () => {
                try {

                    const response = await axios.get("http://localhost:8001/triptype/admin/statistics/logindata");
                    setLoginData(response.data);
                    
                } catch (error) {

                    console.error("로그인 데이터 조회 실패", error);
                }

            };

            fetchLoginData();

        }, []);

        if (!loginData) {
            return <div>데이터 없음</div>;
        }               
        

        const { loginCount, notLoginCount } = loginData;

        const data = [
            ["상태", "사용자 수"],
            ["로그인", loginCount],
            ["비로그인", notLoginCount],
        ];
        
        const options = {
            title: "로그인 / 비로그인 검색 비율",
            pieHole: 0.4,  // 도넛 차트
            legend: { position: "bottom" },
            pieSliceText: "percentage",
        }

        return (
            <Chart 
                chartType="PieChart"
                data={data}
                options={options}
                width="440px"
                height="300px"
                loader={<div>로딩중...</div>}
            />      
        );
    };

    export default LoginChartComponent;
import { Chart } from "react-google-charts";

const LoginChartComponent = () => {

        const data = [
            // pie 차트의 첫번째 행은 두번째 행부터 나열할 데이터들의 대한 설명? 정도이다
           ["로그인 여부", "비율"],
           // 두번째 행부터는 첫 번째 값 : 문자, 두번째 값 : 숫자 이다
           // 현재 하드코딩 된 상태
           ["로그인", 70],
           ["비로그인", 30],     
        ];

        const options = {
            title: "로그인 / 비로그인 비율",
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
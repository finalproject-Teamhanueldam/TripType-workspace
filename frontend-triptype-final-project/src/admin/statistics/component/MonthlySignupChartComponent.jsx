import { Chart } from "react-google-charts";

const MonthlySignupChartComponent = () => {

        const data = [
            ["월", "가입자 수", "탈퇴자 수"],
            ["1월", 100, 10],
            ["2월", 120, 20],
            ["3월", 200, 50],
            ["4월", 50, 100],
            ["5월", 90, 12],
            ["6월", 200, 15],
            ["7월", 250, 17],
            ["8월", 215, 10],
            ["9월", 100, 10],
            ["10월", 17, 14],
            ["11월", 60, 1],
            ["12월", 150, 15],
            
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
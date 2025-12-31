import { useEffect, useState } from "react";
import axios from "axios";

const WeekPriceList = ({ setActiveFilter, searchParams}) => {

    // 일주일간 최저가 상단 데이터 State
    const [ weekPrice, setWeekPrice ] = useState([]);

    // 일주일간 최저가 상단 Status
    const [ activeDay, setActiveDay ] = useState();

    // 일주일간 최저가 상단 Status 변경 함수
    const changeDay = (index) => {
        setActiveDay(index);
        setActiveFilter(0);
    };

    const createEmptyWeek = (baseDate, serverData) => {
    console.log('baseDate', baseDate);

    const result = [];

    const start = new Date(baseDate);
    start.setDate(start.getDate() - 3); // 기준일 -3

    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);

        const label = `${String(d.getMonth() + 1).padStart(2, "0")}월${String(d.getDate()).padStart(2, "0")}일`;

        result.push({
        dateKey: d.toISOString().slice(0, 10), // 비교용
        offerDepartDay: label,
        offerPriceTotal: serverData.forEach((item) => 
                item.offerDepartDay == baseDate ? 
                    item.offerPriceTotal : 
                    "-"
                ),
        });
    }

    return result;
    };


    useEffect(() => {
    const weeklyPriceRender = async () => {
        try {
        const response = await axios.get(
            "http://localhost:8001/triptype/airline/weeklyPrice",
            { params: { ...searchParams } }
        );

        const serverData = response.data;

        console.log('serverData', serverData);

        // 1. 기본 7일 틀 생성
        const baseWeek = createEmptyWeek(searchParams.departDate, serverData);

        // 2. 서버 데이터 덮어쓰기
        serverData.forEach(item => {
            const target = baseWeek.find(
                d => d.dateKey === item.offerDepartDay
            );

            if (target) {
                target.offerPriceTotal = item.offerPriceTotal;
            }
        });


        setWeekPrice(baseWeek);

        } catch (error) {
        console.error(error);
        }
    };

    weeklyPriceRender();
    }, [searchParams]);


    console.log(weekPrice);


    return (
        <div>
            <table>
                <tbody>
                    <tr>
                    {
                        weekPrice.map(({dateKey, offerDepartDay, offerPriceTotal}, index) => 
                        <td key={index} className={ activeDay == index ? "active" : "" } onClick={() => changeDay(index)}>
                            <p className="date">{offerDepartDay}</p>
                            <p className="price">{offerPriceTotal != null ? Math.floor(offerPriceTotal).toLocaleString() + '원' : "-"}</p>
                        </td>
                        )
                    }
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default WeekPriceList;
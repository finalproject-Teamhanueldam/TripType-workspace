import AuthSidebar from "../../common/component/AuthSidebar";

import "../css/AirlineTicket.css"

const AirlineTicketComponent = () => {

    return (
        <div className="wrap">
            < AuthSidebar />
            <div className="statistics-content">
                <h2 style={{ margin : "0px 0px 0px 160px"}}>항공권 관리</h2>


            </div>

        </div>
    );

}
export  default AirlineTicketComponent;

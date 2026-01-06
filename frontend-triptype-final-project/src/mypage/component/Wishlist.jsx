import { useEffect, useState } from "react";
import axios from "axios";
import MyPageSectionTitle from "../common/component/MyPageSectionTitle";
import "../css/Wishlist.css";
import "../css/MyPageCommon.css";

function Wishlist() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await axios.get(
        "http://localhost:8001/triptype/api/mypage/wishlist",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setList(res.data);
    };

    fetchWishlist();
  }, []);

  return (
    <div className="mypage-page">
      <MyPageSectionTitle title="찜 목록" />

      <div className="mypage-card">
        <h3 className="mypage-card-title">찜한 항공권</h3>

        {list.length === 0 ? (
          <p className="mypage-muted">찜한 항공권이 없습니다.</p>
        ) : (
          <div className="wish-list">
            {list.map(item => (
              <div className="wish-item" key={item.flightOfferId}>
                <div className="wish-main">
                  <div className="wish-title">
                    {item.departAirportCode} → {item.arriveAirportCode}
                  </div>
                  <div className="wish-sub">
                    {item.tripType === "ROUND" ? "왕복" : "편도"} ·
                    {item.departDate}
                    {item.returnDate && ` ~ ${item.returnDate}`}
                  </div>
                </div>

                <div className="wish-right">
                  <div className="wish-price">
                    {item.totalPrice
                    ? `₩${item.totalPrice.toLocaleString()}`
                    : "가격 정보 없음"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;

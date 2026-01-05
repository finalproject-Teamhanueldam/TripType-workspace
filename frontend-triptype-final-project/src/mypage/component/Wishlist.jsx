import MyPageSectionTitle from "../common/component/MyPageSectionTitle";
import "../css/Wishlist.css";
import "../css/MyPageCommon.css";

function Wishlist() {
  return (
    <div className="mypage-page">
      <MyPageSectionTitle title="찜 목록" />

      <div className="mypage-card">
        <h3 className="mypage-card-title">찜한 항공권</h3>
        <p className="mypage-muted">
          조원이 찜 데이터 구조 알려주면 카드 리스트로 바로 붙일 수 있어요.
        </p>

        <div className="wish-list">
          <div className="wish-item">
            <div className="wish-main">
              <div className="wish-title">ICN → NRT</div>
              <div className="wish-sub">왕복 · 2026-02-01 ~ 2026-02-05</div>
            </div>
            <div className="wish-right">
              <div className="wish-price">₩300,000</div>
              <button className="danger-btn">삭제</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
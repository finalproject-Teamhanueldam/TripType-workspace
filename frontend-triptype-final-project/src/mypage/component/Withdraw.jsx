import MyPageSectionTitle from "../common/component/MyPageSectionTitle";
import "../css/Withdraw.css";
import "../css/MyPageCommon.css";

function Withdraw() {
  return (
    <div className="mypage-page">
      <MyPageSectionTitle title="회원 탈퇴" />

      <div className="mypage-card withdraw-card">
        <h3 className="mypage-card-title danger-title">정말 탈퇴하시겠어요?</h3>
        <p className="mypage-muted">
          탈퇴하면 계정이 비활성화되며, 일부 데이터는 복구가 어려울 수 있어요.
        </p>

        <div className="field">
          <label>비밀번호 확인</label>
          <input type="password" placeholder="비밀번호를 입력하세요" />
        </div>

        <div className="btn-row">
          <button className="danger-btn">탈퇴하기</button>
        </div>
      </div>
    </div>
  );
}

export default Withdraw;
import { useState } from "react";
import axios from "axios";

import MyPageSectionTitle from "../common/component/MyPageSectionTitle";
import "../css/Withdraw.css";
import "../css/MyPageCommon.css";

function Withdraw() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);

  const handleWithdraw = async () => {
    if (!password) {
      setMsg({ type: "error", text: "비밀번호를 입력해주세요." });
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/api/mypage/withdraw`,
        { password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        }
      );

      // 로그아웃 처리
      localStorage.clear();
      window.location.href = "/";

    } catch (e) {
      const code = e.response?.data?.message;

      let text = "비밀번호가 올바르지 않습니다.";

      if (code === "ALREADY_WITHDRAWN") {
        text = "이미 탈퇴한 계정입니다.";
      }

      setMsg({ type: "error", text });
    }
  };

  return (
    <div className="mypage-page">
      <MyPageSectionTitle title="회원 탈퇴" />

      <div className="mypage-card withdraw-card">
        <h3 className="mypage-card-title danger-title">
          정말 탈퇴하시겠어요?
        </h3>

        <p className="mypage-muted">
          탈퇴하면 계정이 비활성화되며, 일부 데이터는 복구할 수 없어요.
        </p>

        <div className="field">
          <label>비밀번호 확인</label>
          <input
            type="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              setMsg(null);
            }}
          />
        </div>

        <div className="btn-row">
          <button className="danger-btn" onClick={handleWithdraw}>
            탈퇴하기
          </button>

          {msg && (
            <p className={`msg ${msg.type}`}>
              {msg.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Withdraw;

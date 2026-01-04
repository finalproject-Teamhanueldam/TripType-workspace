import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginTab() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({ memberId: "", memberPassword: "", saveId: false});
  const [loginError, setLoginError] = useState(null);
  const [capsState, setCapsState] = useState("unknown"); // "unknown" | "on" | "off"

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setLoginForm({ ...loginForm, [name]: type === 'checkbox' ? checked : value });
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/login`,
        {
          memberId: loginForm.memberId,
          memberPassword: loginForm.memberPassword
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      // 로그인 성공 → 저장
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("memberName", res.data.memberName);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem(
        "memberId",
        res.data.memberId ?? loginForm.memberId
      );
      // (선택) 아이디 저장 체크 시
      if (loginForm.saveId) {
        localStorage.setItem("savedMemberId", loginForm.memberId);
      } else {
        localStorage.removeItem("savedMemberId");
      }
      window.dispatchEvent(new Event("loginChanged"));
      // 메인으로 이동
      navigate("/");

    } catch (err) {
      console.error(err);

      const data = err?.response?.data;

      let message = "로그인에 실패했습니다.";

      switch (data?.message) {
        case "WITHDRAWN_ACCOUNT":
          message = 
              "탈퇴 처리된 계정입니다.\n" +
              "재가입을 원하시면 메인 페이지의\n" +
              "오픈카카오톡 1:1 상담을 이용해주세요.";
          break;
        case "LOCKED_ACCOUNT_INACTIVE":
          message =
              "장기 미접속으로 계정이 잠금 처리되었습니다.\n" +
              "본인 인증 후 잠금 해제가 가능합니다.";
          break;
        case "LOCKED_ACCOUNT":
          message = "계정이 잠겨 로그인할 수 없습니다.";
          break;
        case "INVALID_CREDENTIALS":
          message = "이메일 또는 비밀번호가 올바르지 않습니다.";
          break;
      }

      setLoginError({
        message,
        loginFailCount: data?.loginFailCount ?? 0,
        locked: data?.message === "LOCKED_ACCOUNT",
        withdrawn: data?.message === "WITHDRAWN_ACCOUNT"
      });
    }
  };

  const handleSocial = (provider) => {
    // TODO: 백엔드 소셜 로그인 엔드포인트로 이동 (예: /oauth2/authorization/naver)
    window.location.href =
    `${API_BASE_URL}/oauth2/authorization/${provider}`;
  };

  const handleCapsCheck = (e) => {
    if (!e.getModifierState) return;
    setCapsState(e.getModifierState("CapsLock") ? "on" : "off");
  };

  useEffect(() => {
    const savedId = localStorage.getItem("savedMemberId");

    if (savedId) {
      setLoginForm(prev => ({
        ...prev,
        memberId: savedId,
        saveId: true,
      }));
    }
  }, []);

  return (
    <div>
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="field">
          <label>이메일</label>
          <input type="email" name="memberId"
                 value={loginForm.memberId} onChange={handleChange}
                 placeholder="example@email.com" required />
        </div>

        <div className="field">
          <label>비밀번호</label>
          <input type="password" name="memberPassword"
                 value={loginForm.memberPassword}
                 onChange={handleChange} onKeyUp={handleCapsCheck}
                 placeholder="비밀번호를 입력하세요" required />

          {capsState === "on" && (
            <div className="caps-warning">
              ⚠ Caps Lock이 켜져 있어요
            </div>
          )}

          {capsState === "unknown" && (
            <div className="caps-hint">
              ⌨ 비밀번호 입력 시 Caps Lock 상태를 확인해주세요
            </div>
          )}
        </div>

        {/* 아이디 저장 및 찾기 링크 영역 */}
        <div className="login-options">
          <label>
            <input type="checkbox" name="saveId"
                   checked={loginForm.saveId} onChange={handleChange} />
            아이디 저장
          </label>
          <span className="find-link"
                onClick={() => navigate("/member?tab=find")} style={{cursor:'pointer'}}>
            아이디/비밀번호 찾기
          </span>
        </div>

        {loginError && (
          <div className="login-error">
            <div className="login-error__msg">
              {loginError.message.split("\n").map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>

            {!loginError.locked && loginError.loginFailCount > 0 && (
              <div className="login-error__sub">
                로그인 실패 {loginError.loginFailCount}/5회
              </div>
            )}

            {loginError.locked && !loginError.withdrawn && (
              <button
                type="button"
                className="ghost-btn"
                style={{ marginTop: "10px", width: "100%" }}
                onClick={() => navigate("/member/unlock")}
              >
                계정 잠금 해제
              </button>
            )}
          </div>
        )}

        <button className="primary-btn" type="submit">로그인</button>
      </form>

      <div className="divider"><span>또는</span></div>

      <div className="social-login">
        <button className="social-btn naver" type="button" onClick={() => handleSocial("naver")}>
          네이버로 시작하기
        </button>
        <button className="social-btn kakao" type="button" onClick={() => handleSocial("kakao")}>
          카카오로 시작하기
        </button>
      </div>
    </div>
  );
}

export default LoginTab;

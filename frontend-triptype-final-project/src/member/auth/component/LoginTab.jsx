import { useState } from "react";

function LoginTab() {
  const [loginForm, setLoginForm] = useState({ memberId: "", memberPassword: "" });

  const handleChange = e => setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  const handleLogin = e => {
    e.preventDefault();
    // TODO: axios.post("/auth/login", loginForm)
    console.log(loginForm);
  };

  const handleSocial = (provider) => {
    // TODO: 백엔드 소셜 로그인 엔드포인트로 이동 (예: /oauth2/authorization/naver)
    console.log("social:", provider);
  };

  return (
    <div>
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="field">
          <label>이메일</label>
          <input type="email" name="memberId" value={loginForm.memberId} onChange={handleChange} placeholder="example@email.com" required />
        </div>

        <div className="field">
          <label>비밀번호</label>
          <input type="password" name="memberPassword" value={loginForm.memberPassword} onChange={handleChange} placeholder="비밀번호를 입력하세요" required />
        </div>

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

      <div className="auth-hint">
        아이디/비밀번호를 잊으셨나요? <span className="hint-strong">상단 ‘찾기’ 탭</span>에서 바로 진행할 수 있어요.
      </div>
    </div>
  );
}

export default LoginTab;

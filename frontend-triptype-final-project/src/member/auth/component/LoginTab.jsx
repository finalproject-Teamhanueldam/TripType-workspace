import { useState } from "react";
import { useNavigate } from "react-router-dom"

function LoginTab() {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({ memberId: "", memberPassword: "", saveId: false});

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setLoginForm({ ...loginForm, [name]: type === 'checkbox' ? checked : value });
  }
  const handleLogin = e => {
    e.preventDefault();
    // TODO: axios.post("/auth/login", loginForm)
    console.log("로그인 시도:", loginForm);
    navigate("/");
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  console.log("API BASE:", import.meta.env.VITE_API_BASE_URL);
  const handleSocial = (provider) => {
    // TODO: 백엔드 소셜 로그인 엔드포인트로 이동 (예: /oauth2/authorization/naver)
    window.location.href =
    `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/${provider}`;
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

        {/* 아이디 저장 및 찾기 링크 영역 */}
        <div className="login-options">
          <label>
            <input type="checkbox" name="saveId" checked={loginForm.saveId} onChange={handleChange} />
            아이디 저장
          </label>
          <span className="find-link" onClick={() => navigate("/member?tab=find")} style={{cursor:'pointer'}}>
            아이디/비밀번호 찾기
          </span>
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
    </div>
  );
}

export default LoginTab;

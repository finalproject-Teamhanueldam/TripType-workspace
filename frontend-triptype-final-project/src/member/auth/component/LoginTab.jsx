import { useState } from "react";

function LoginTab() {
  const [loginForm, setLoginForm] = useState({
    memberId: "",
    memberPassword: ""
  });

  const handleChange = e => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = e => {
    e.preventDefault();

    console.log("로그인 요청:", loginForm);
    // TODO: axios.post("/auth/login", loginForm)
  };

  return (
    <form className="auth-form" onSubmit={handleLogin}>
      <input
        type="email"
        name="memberId"
        placeholder="이메일"
        value={loginForm.memberId}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="memberPassword"
        placeholder="비밀번호"
        value={loginForm.memberPassword}
        onChange={handleChange}
        required
      />

      <button type="submit">로그인</button>
    </form>
  );
}

export default LoginTab;
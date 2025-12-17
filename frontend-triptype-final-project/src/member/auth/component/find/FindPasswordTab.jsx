import { useState, useMemo } from "react";


function FindPasswordTab() {
  const [form, setForm] = useState({
    memberId: "",
    authCode: "",
    newPassword: "",
    passwordConfirm: ""
  });

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // 실시간 유효성 검사 (JoinTab 로직 재활용)
  const msg = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.memberId);
    const pwOk = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[^\s]{8,16}$/.test(form.newPassword);
    const pwMatch = form.newPassword && form.newPassword === form.passwordConfirm;
    const authCodeOk = form.authCode === "123456";

    return {
      email: form.memberId ? (emailOk ? { type: "ok", text: "올바른 이메일 형식입니다." } : { type: "err", text: "이메일 형식을 확인해주세요." }) : null,
      auth: isAuthChecked ? (isEmailVerified ? { type: "ok", text: "인증되었습니다." } : { type: "err", text: "인증번호가 일치하지 않습니다." }) : null,
      pw: form.newPassword ? (pwOk ? { type: "ok", text: "안전한 비밀번호입니다." } : { type: "err", text: "영문+숫자+특수문자 포함 8-16자" }) : null,
      pw2: form.passwordConfirm ? (pwMatch ? { type: "ok", text: "비밀번호가 일치합니다." } : { type: "err", text: "비밀번호가 일치하지 않습니다." }) : null
    };
  }, [form, isEmailVerified, isAuthChecked]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const sendAuthCode = () => {
    if (!form.memberId || msg.email?.type === 'err') return;
    setIsEmailSent(true);
    setIsAuthChecked(false);
  };

  const verifyAuthCode = () => {
    setIsAuthChecked(true);
    if (form.authCode === "123456") setIsEmailVerified(true);
  };

  return (
    <div className="auth-form">
      <div className="field">
        <label>가입한 이메일</label>
        <div className="field-group">
          <input type="email" name="memberId" value={form.memberId} onChange={onChange} placeholder="example@email.com" disabled={isEmailVerified} />
          <button type="button" className="ghost-btn" onClick={sendAuthCode} disabled={isEmailVerified}>
            {isEmailSent ? "재발송" : "인증번호 발송"}
          </button>
        </div>
        {msg.email && <div className={`inline-msg ${msg.email.type}`}>{msg.email.text}</div>}
      </div>

      {isEmailSent && (
        <div className="field" style={{ marginTop: '18px' }}>
          <label>인증번호 확인</label>
          <div className="field-group">
            <input type="text" name="authCode" value={form.authCode} onChange={onChange} placeholder="인증번호 6자리" disabled={isEmailVerified} />
            <button type="button" className={`ghost-btn ${isEmailVerified ? 'verify' : ''}`} onClick={verifyAuthCode} disabled={isEmailVerified}>
              {isEmailVerified ? "인증 완료" : "확인"}
            </button>
          </div>
          {msg.auth && <div className={`inline-msg ${msg.auth.type}`}>{msg.auth.text}</div>}
        </div>
      )}

      {isEmailVerified && (
        <div className="password-reset-area" style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #f3f4f6" }}>
          <div className="field">
            <label>새 비밀번호</label>
            <input type="password" name="newPassword" value={form.newPassword} onChange={onChange} placeholder="영문, 숫자, 특수문자 포함 8-16자" />
            {msg.pw && <div className={`inline-msg ${msg.pw.type}`}>{msg.pw.text}</div>}
          </div>
          <div className="field">
            <label>새 비밀번호 확인</label>
            <input type="password" name="passwordConfirm" value={form.passwordConfirm} onChange={onChange} placeholder="비밀번호 재입력" />
            {msg.pw2 && <div className={`inline-msg ${msg.pw2.type}`}>{msg.pw2.text}</div>}
          </div>
          <button type="button" className="primary-btn">비밀번호 변경하기</button>
        </div>
      )}
    </div>
  );
}
export default FindPasswordTab;
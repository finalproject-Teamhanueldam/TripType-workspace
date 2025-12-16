import { useMemo, useState } from "react";

function JoinTab() {
  const [form, setForm] = useState({
    memberId: "",
    memberPassword: "",
    passwordConfirm: "",
    memberName: "",
    memberBirthDate: "",
    memberGender: "",
    memberPhone: "",
    authCode: ""
  });

  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ 실시간 인라인 메시지
  const msg = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.memberId);
    const pwOk = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[^\s]{8,16}$/
    // 영문+숫자+특수문자 포함 8자이상 16자 이하(공백 금지, UX 고려)
    const pwMatch = form.memberPassword && form.memberPassword === form.passwordConfirm;

    return {
      email: form.memberId ? (emailOk ? { type: "ok", text: "올바른 이메일 형식입니다." } : { type: "err", text: "이메일 형식을 확인해주세요." }) : null,
      pw: form.memberPassword ? (pwOk ? { type: "ok", text: "사용 가능한 비밀번호입니다." } : { type: "err", text: "영문+숫자+특수문자 포함 8자 이상 16자 이하로 설정해주세요." }) : null,
      pw2: form.passwordConfirm ? (pwMatch ? { type: "ok", text: "비밀번호가 일치합니다." } : { type: "err", text: "비밀번호가 일치하지 않습니다." }) : null,
    };
  }, [form.memberId, form.memberPassword, form.passwordConfirm]);

  const sendEmailCode = async () => {
    // TODO: axios.post("/auth/send-code", { email: form.memberId })
    if (!msg.email || msg.email.type === "err") return alert("이메일 형식을 먼저 확인해주세요.");
    setEmailSent(true);
    setEmailVerified(false);
    console.log("인증번호 발송:", form.memberId);
  };

  const verifyEmailCode = async () => {
    // TODO: axios.post("/auth/verify-code", { email: form.memberId, code: form.authCode })
    if (!form.authCode) return alert("인증번호를 입력해주세요.");
    setEmailVerified(true);
    console.log("인증번호 확인:", form.authCode);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!emailVerified) return alert("이메일 인증을 완료해주세요.");
    if (msg.pw?.type === "err" || msg.pw2?.type === "err") return;

    // TODO: axios.post("/member/join", form)
    console.log("회원가입:", form);
  };

  return (
    <form className="auth-form" onSubmit={submit}>
      <div className="field">
        <label>이메일</label>
        <div className="inline-row">
          <input type="email" name="memberId" value={form.memberId} onChange={onChange} placeholder="example@email.com" required />
          <button className="ghost-btn" type="button" onClick={sendEmailCode}>
            인증번호 발송
          </button>
        </div>
        {msg.email && <div className={`inline-msg ${msg.email.type}`}>{msg.email.text}</div>}
      </div>

      {emailSent && (
        <div className="field">
          <label>인증번호</label>
          <div className="inline-row">
            <input type="text" name="authCode" value={form.authCode} onChange={onChange} placeholder="6자리 인증번호" />
            <button className="ghost-btn" type="button" onClick={verifyEmailCode}>
              확인
            </button>
          </div>
          {emailVerified
            ? <div className="inline-msg ok">이메일 인증이 완료되었습니다.</div>
            : <div className="inline-msg info">인증번호를 입력 후 확인을 눌러주세요.</div>}
        </div>
      )}

      <div className="field">
        <label>비밀번호</label>
        <input type="password" name="memberPassword" value={form.memberPassword} onChange={onChange} placeholder="영문+숫자 포함 8자 이상" required />
        {msg.pw && <div className={`inline-msg ${msg.pw.type}`}>{msg.pw.text}</div>}
      </div>

      <div className="field">
        <label>비밀번호 확인</label>
        <input type="password" name="passwordConfirm" value={form.passwordConfirm} onChange={onChange} placeholder="비밀번호를 한 번 더 입력" required />
        {msg.pw2 && <div className={`inline-msg ${msg.pw2.type}`}>{msg.pw2.text}</div>}
      </div>

      <div className="field">
        <label>이름</label>
        <input type="text" name="memberName" value={form.memberName} onChange={onChange} required />
      </div>

      <div className="field">
        <label>생년월일</label>
        <input type="date" name="memberBirthDate" value={form.memberBirthDate} onChange={onChange} required />
      </div>

      <div className="field">
        <label>성별</label>
        <div className="gender-box">
          <label className="radio-pill">
            <input type="radio" name="memberGender" value="M" onChange={onChange} required />
            남
          </label>
          <label className="radio-pill">
            <input type="radio" name="memberGender" value="F" onChange={onChange} required />
            여
          </label>
        </div>
      </div>

      <div className="field">
        <label>휴대폰 번호</label>
        <input type="text" name="memberPhone" value={form.memberPhone} onChange={onChange} placeholder="010-0000-0000" />
      </div>

      <button className="primary-btn" type="submit">회원가입</button>
    </form>
  );
}

export default JoinTab;

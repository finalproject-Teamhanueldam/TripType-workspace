import { useState, useMemo, useEffect } from "react";
import "../../css/AuthContainer.css";
import axios from "axios";

function FindPasswordTab() {
  const [form, setForm] = useState({
    memberName: "",
    memberId: "",
    authCode: "",
    newPassword: "",
    passwordConfirm: ""
  });

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [timer, setTimer] = useState(300); // 5분 = 300초
  const [isTimerActive, setIsTimerActive] = useState(false);

  const [emailMsg, setEmailMsg] = useState(null);
  const [authMsg, setAuthMsg] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resetMsg, setResetMsg] = useState(null); // null | { type: "ok" | "err", text: string }

  // 실시간 유효성 검사 (JoinTab 로직 재활용)
  const msg = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.memberId);
    const pwOk = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[^\s]{8,16}$/.test(form.newPassword);
    const pwMatch = form.newPassword && form.newPassword === form.passwordConfirm;

    return {
      email: form.memberId && !emailOk ? { type: "err", text: "이메일 형식을 확인해주세요." } : null,
      auth: isAuthChecked
      ? timer === 0
        ? { type: "err", text: "인증 시간이 만료되었습니다. 다시 시도해주세요." }
        : null
      : null,
      pw: form.newPassword ? (pwOk ? { type: "ok", text: "안전한 비밀번호입니다." } : { type: "err", text: "영문+숫자+특수문자 포함 8-16자" }) : null,
      pw2: form.passwordConfirm ? (pwMatch ? { type: "ok", text: "비밀번호가 일치합니다." } : { type: "err", text: "비밀번호가 일치하지 않습니다." }) : null
    };
  }, [form, isEmailVerified, isAuthChecked, timer]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const sendAuthCode = async () => {
    if (!form.memberName.trim()) {
      setEmailMsg({ type: "err", text: "이름을 입력해주세요." });
      return;
    }
    if (!form.memberId || msg.email?.type === "err") {
      setEmailMsg({ type: "err", text: "이메일 형식을 확인해주세요." });
      return;
    }

    try {
      setIsSending(true);       // 발송 중 시작
      setEmailMsg(null);
      setAuthMsg(null);

      await axios.post(
        "http://localhost:8001/triptype/mail/auth/reset/send",
        {
          memberName: form.memberName,
          memberId: form.memberId
        }
      );

      setEmailMsg({ type: "ok", text: "인증번호가 발송되었습니다." });
      // 서버 성공 시에만 UI 상태 변경
      setIsEmailSent(true);

      setTimer(300);           // 타이머 리셋
      setIsTimerActive(true);  // 타이머 시작
      
      setResendCooldown(30);    // 30초 쿨타임 시작

    } catch (e) {
      const message = e.response?.data?.message;

      // 404(불일치)면 사용자에게 알려주기
      if (e.response?.status === 404) {
        setEmailMsg({ type: "err", text: message || "이름 또는 이메일이 일치하지 않습니다." });
        return;
      }

      setEmailMsg({ type: "err", text: message || "인증번호 발송에 실패했습니다." });
    } finally {
      setIsSending(false);      // 발송 중 종료
    }
  };

  const verifyAuthCode = async () => {
    setIsAuthChecked(true);

    try {
      await axios.post(
        "http://localhost:8001/triptype/mail/auth/verify",
        {
          email: form.memberId,
          authCode: form.authCode
        }
      );

      // 인증 성공
      setIsEmailVerified(true);
      setIsTimerActive(false);
      setAuthMsg(null); // 성공 시 서버 메시지 제거

    } catch (e) {
      // 인증 실패 (401)
      setIsEmailVerified(false);
      setAuthMsg({ type: "err", text: "인증번호가 일치하지 않습니다." });
    }
  };

  const formatTime = (sec) => {
    const min = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${min}:${s}`;
  };

  useEffect(() => {
    if (!isTimerActive) return;

    if (timer === 0) {
      setIsTimerActive(false);
      setIsAuthChecked(true); // 만료 메시지 보여주려면 필수
      setIsEmailVerified(false);
      setForm(prev => ({ ...prev, authCode: "" })); // 입력칸은 남기되 값만 비움
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const resetPassword = async () => {
    try {
      setResetMsg(null);

      await axios.post(
        "http://localhost:8001/triptype/member/password/reset",
        {
          memberName: form.memberName,
          memberId: form.memberId,
          newPassword: form.newPassword
        }
      );

      // 성공 메시지 (인라인)
      setResetMsg({
        type: "ok",
        text: "비밀번호가 재설정되었습니다. 잠시 후 로그인 페이지로 이동합니다."
      });

      // 1.5초 후 로그인 이동
      setTimeout(() => {
        window.location.href = "/member?tab=login";
      }, 1500);

    } catch (e) {
      setResetMsg({
        type: "err",
        text: e.response?.data?.message || "비밀번호 재설정에 실패했습니다."
      });
    }
  };

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const interval = setInterval(() => {
      setResendCooldown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCooldown]);



  return (
    <div className="auth-form find">

      <div className="field">
        <label>이름</label>
        <input
          type="text"
          name="memberName"
          value={form.memberName}
          onChange={onChange}
          placeholder="이름을 입력해주세요"
          disabled={isEmailVerified}
        />
      </div>

      <div className="field">
        <label>가입한 이메일</label>
        <div className="field-group">
          <input type="email" name="memberId" value={form.memberId} onChange={onChange} placeholder="example@email.com" disabled={isEmailVerified} />
          <button
            type="button"
            className="ghost-btn"
            onClick={sendAuthCode}
            disabled={isEmailVerified || isSending || resendCooldown > 0}
          >
            {isEmailVerified
              ? "인증 완료"
              : isSending
                ? "발송 중..."
                : resendCooldown > 0
                  ? `재발송 (${resendCooldown}초)`
                  : isEmailSent
                    ? "재발송"
                    : "인증번호 발송"}
          </button>
        </div>

        {emailMsg && (
          <div className={`inline-msg ${emailMsg.type}`} style={{ marginTop: "6px" }}>
            {emailMsg.text}
          </div>
        )}

      </div>

      {isEmailSent && (
        <div className="field" style={{ marginTop: "18px" }}>
          <label>인증번호 확인</label>

          <div className="auth-code-group">
          <div className="field-group">
            {/* input을 감싸서 타이머를 input 내부에 올림 */}
            <div className="auth-input-wrap" style={{ flex: 1 }}>
              <input
                type="text"
                name="authCode"
                value={form.authCode}
                onChange={onChange}
                placeholder="인증번호 6자리"
                disabled={isEmailVerified || timer === 0}
              />

              {/* 버튼 아래가 아니라 input 안쪽에 타이머 표시 */}
              {!isEmailVerified && (
                <span className={`auth-timer-inline ${timer <= 30 ? "danger" : ""}`}>
                  {formatTime(timer)}
                </span>
              )}
            </div>

            <button
              type="button"
              className={`ghost-btn ${isEmailVerified ? "verify" : ""}`}
              onClick={verifyAuthCode}
              disabled={isEmailVerified || timer === 0}
            >
              {isEmailVerified ? "인증 완료" : "확인"}
            </button>
          </div>
        </div>

          {/* 메시지는 원래 위치(입력칸 아래)로 */}
          {authMsg && (
            <div className={`inline-msg ${authMsg.type}`} style={{ marginTop: "6px" }}>
              {authMsg.text}
            </div>
          )}
          
        </div>
      )}

      {isEmailVerified && (
        <div className="field" style={{ marginTop: "24px" }}>
          <label>새 비밀번호</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={onChange}
            placeholder="새 비밀번호"
          />
          {msg.pw && <div className={`inline-msg ${msg.pw.type}`}>{msg.pw.text}</div>}

          <input
            type="password"
            name="passwordConfirm"
            value={form.passwordConfirm}
            onChange={onChange}
            placeholder="비밀번호 확인"
            style={{ marginTop: "10px" }}
          />
          {msg.pw2 && <div className={`inline-msg ${msg.pw2.type}`}>{msg.pw2.text}</div>}

          <button
            type="button"
            className="primary-btn"
            style={{ marginTop: "16px" }}
            onClick={resetPassword}
            disabled={msg.pw?.type !== "ok" || msg.pw2?.type !== "ok"}
          >
            비밀번호 재설정
          </button>

          {resetMsg && (
            <div
              className={`inline-msg ${resetMsg.type}`}
              style={{ marginTop: "10px" }}
            >
              {resetMsg.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default FindPasswordTab;
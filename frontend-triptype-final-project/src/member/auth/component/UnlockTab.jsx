import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/AuthContainer.css";
import logo from "../../../images/logo.png";

function UnlockTab() {
  const navigate = useNavigate();

  /* ======================
     state
  ====================== */
  const [form, setForm] = useState({
    memberName: "",
    memberId: "",
    authCode: "",
    newPassword: "",
    passwordConfirm: "",
  });

  const [isMailSent, setIsMailSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [timer, setTimer] = useState(300);        // 인증 유효시간
  const [resendCooldown, setResendCooldown] = useState(0); // 재발송 제한

  // 행동 결과 메시지 전용
  const [msg, setMsg] = useState({ type: "", text: "" });

  // 필드 단위 에러 표시용
  const [touched, setTouched] = useState({
    memberName: false,
    authCode: false,
  });

  /* ======================
     utils
  ====================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (name) {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
  };

  const formatMMSS = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  /* ======================
     validation
  ====================== */
  const emailOk = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.memberId),
    [form.memberId]
  );

  const authCodeOk = useMemo(
    () => /^\d{6}$/.test(form.authCode),
    [form.authCode]
  );

  const pwRuleOk = useMemo(() => {
    const rule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[^\s]{8,16}$/;
    return rule.test(form.newPassword);
  }, [form.newPassword]);

  const pwMatchOk = useMemo(
    () =>
      form.newPassword &&
      form.newPassword === form.passwordConfirm,
    [form.newPassword, form.passwordConfirm]
  );

  /* ======================
     handlers
  ====================== */

  // 인증번호 발송 / 재발송
  const handleSendMail = () => {
    if (!form.memberName.trim()) {
      setTouched((p) => ({ ...p, memberName: true }));
      return;
    }

    if (!form.memberId.trim()) {
      setMsg({ type: "err", text: "이메일을 입력해주세요." });
      return;
    }

    if (!emailOk) {
      setMsg({ type: "err", text: "올바른 이메일 형식이 아닙니다." });
      return;
    }

    if (resendCooldown > 0) return;

    setIsMailSent(true);
    setIsVerified(false);

    setTimer(300);
    setResendCooldown(30);

    // ⭐ 핵심: 인증 재시작 시 비밀번호 초기화
    setForm((prev) => ({
      ...prev,
      authCode: "",
      newPassword: "",
      passwordConfirm: "",
    }));

    setTouched({ memberName: false, authCode: false });

    setMsg({ type: "ok", text: "인증번호가 이메일로 발송되었습니다." });
  };

  const handleVerifyCode = () => {
    setTouched((p) => ({ ...p, authCode: true }));

    if (!form.authCode.trim()) return;
    if (!authCodeOk) return;
    if (timer <= 0) {
      setMsg({ type: "err", text: "인증 시간이 만료되었습니다." });
      return;
    }

    setIsVerified(true);
    setMsg({ type: "ok", text: "인증이 완료되었습니다." });
  };

  const handleUnlock = () => {
    if (!isVerified) return;

    if (!pwRuleOk || !pwMatchOk) {
      setMsg({ type: "err", text: "비밀번호를 다시 확인해주세요." });
      return;
    }

    setMsg({
      type: "ok",
      text: "비밀번호가 변경되고 계정 잠금이 해제되었습니다.",
    });

    setTimeout(() => {
      navigate("/member?tab=login");
    }, 1200);
  };

  /* ======================
     timers
  ====================== */
  useEffect(() => {
    if (!isMailSent || isVerified || timer <= 0) return;
    const itv = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(itv);
  }, [isMailSent, isVerified, timer]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const itv = setInterval(() => {
      setResendCooldown((c) => c - 1);
    }, 1000);
    return () => clearInterval(itv);
  }, [resendCooldown]);

  /* ======================
     render
  ====================== */
  return (
    <div className="auth-page unlock">
      <div className="auth-card">
        <div className="auth-brand" onClick={() => navigate("/")}>
          <img src={logo} alt="TripType" className="auth-logo" />
          <div className="auth-title">계정 잠금 해제</div>
          <div className="auth-subtitle">
            이메일 인증 후 비밀번호를 변경해주세요
          </div>
        </div>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>

          {/* 이름 */}
          <div className="field">
            <label>이름</label>
            <input
              type="text"
              name="memberName"
              value={form.memberName}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isMailSent}
            />
            {touched.memberName && !form.memberName.trim() && (
              <div className="inline-msg err">이름을 입력해주세요.</div>
            )}
          </div>

          {/* 이메일 + 발송 */}
          <div className="field-group">
            <div className="field" style={{ flex: 1 }}>
              <label>이메일</label>
              <input
                type="email"
                name="memberId"
                value={form.memberId}
                onChange={handleChange}
                disabled={isMailSent && resendCooldown > 0}
              />
            </div>

            <div className="field">
              <label>&nbsp;</label>
              <button
                type="button"
                className="ghost-btn"
                onClick={handleSendMail}
                disabled={resendCooldown > 0}
              >
                {resendCooldown > 0
                  ? `재발송 (${resendCooldown}초)`
                  : isMailSent
                  ? "재발송"
                  : "인증번호 발송"}
              </button>
            </div>
          </div>

          {/* 🔹 발송/인증 메시지 전용 영역 (위치 제어용 wrapper) */}
          {msg.text && (
            <div className={`action-msg ${msg.type}`}>
              {msg.text}
            </div>
          )}

          {/* 인증번호 */}
          {isMailSent && (
            <div className="field-group">
              <div className="field auth-code-group" style={{ flex: 1 }}>
                <label>인증번호</label>
                <div className="auth-input-wrap">
                  <input
                    type="text"
                    name="authCode"
                    value={form.authCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={6}
                    disabled={isVerified}
                  />
                  {!isVerified && timer > 0 && (
                    <span className="auth-timer-inline">
                      {formatMMSS(timer)}
                    </span>
                  )}
                </div>

                {touched.authCode && !form.authCode && (
                  <div className="inline-msg err">
                    인증번호를 입력해주세요.
                  </div>
                )}
                {touched.authCode && form.authCode && !authCodeOk && (
                  <div className="inline-msg err">
                    인증번호는 6자리 숫자입니다.
                  </div>
                )}
              </div>

              <div className="field">
                <label>&nbsp;</label>
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={handleVerifyCode}
                  disabled={!authCodeOk || isVerified}
                >
                  인증 확인
                </button>
              </div>
            </div>
          )}

          {/* 비밀번호 변경 */}
          {isVerified && (
            <>
              <div className="field">
                <label>새 비밀번호</label>
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                />
                {form.newPassword && (
                  <div className={`inline-msg ${pwRuleOk ? "ok" : "err"}`}>
                    {pwRuleOk
                      ? "안전한 비밀번호입니다."
                      : "영문·숫자·특수문자 포함 8~16자"}
                  </div>
                )}
              </div>

              <div className="field">
                <label>비밀번호 확인</label>
                <input
                  type="password"
                  name="passwordConfirm"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                />
                {form.passwordConfirm && (
                  <div className={`inline-msg ${pwMatchOk ? "ok" : "err"}`}>
                    {pwMatchOk
                      ? "비밀번호가 일치합니다."
                      : "비밀번호가 일치하지 않습니다."}
                  </div>
                )}
              </div>
            </>
          )}

          <button
            type="button"
            className="primary-btn"
            disabled={!isVerified || !pwRuleOk || !pwMatchOk}
            onClick={handleUnlock}
          >
            비밀번호 변경 및 잠금 해제
          </button>
        </form>
      </div>
    </div>
  );
}

export default UnlockTab;

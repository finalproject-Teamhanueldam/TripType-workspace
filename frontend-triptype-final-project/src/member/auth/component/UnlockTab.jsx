import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  // 이메일 발송 결과
  const [mailMsg, setMailMsg] = useState(null); 
  // 인증번호 검증 결과
  const [authMsg, setAuthMsg] = useState(null);
  // 최종 잠금 해제 결과
  const [unlockMsg, setUnlockMsg] = useState(null);
  // 발송 중 상태 확인
  const [isSendingMail, setIsSendingMail] = useState(false);

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
  const handleSendMail = async () => {
    if (!form.memberName.trim()) {
      setTouched((p) => ({ ...p, memberName: true }));
      return;
    }

    if (!form.memberId.trim() || !emailOk) {
      setMailMsg({ type: "err", text: "이메일을 확인해주세요." });
      return;
    }

    if (resendCooldown > 0 || isSendingMail) return;

    try {
        setIsSendingMail(true); // 발송 시작

        await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/mail/auth/unlock/send`,
        {
            memberName: form.memberName,
            memberId: form.memberId,
        }
        );

        setIsMailSent(true);
        setIsVerified(false);
        setTimer(300);
        setResendCooldown(30);

        setForm((prev) => ({
            ...prev,
            authCode: "",
            newPassword: "",
            passwordConfirm: "",
        }));

        setMailMsg({ type: "ok", text: "인증번호가 이메일로 발송되었습니다." });
        setAuthMsg(null);
        setUnlockMsg(null);

    } catch (e) {
        setMailMsg({
            type: "err",
            text: e.response?.data?.message || "인증번호 발송에 실패했습니다.",
        });;
    } finally {
        setIsSendingMail(false); // 발송 종료
    }
  };

  const handleVerifyCode = async () => {
    if (!authCodeOk || timer <= 0) return;

    try {
        await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/mail/auth/verify`,
            {
                email: form.memberId,
                authCode: form.authCode,
            }
        );

        setIsVerified(true);
        setAuthMsg(null);

    } catch {
        setAuthMsg({ type: "err", text: "인증번호가 일치하지 않습니다." });
    }
  };

  const handleUnlock = async () => {
    if (!isVerified || !pwRuleOk || !pwMatchOk) return;

    try {
        await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/member/unlock`,
            {
                memberName: form.memberName,
                memberId: form.memberId,
                authCode: form.authCode,
                newPassword: form.newPassword,
            }
        );

        setUnlockMsg({
            type: "ok",
            text: "비밀번호가 변경되고 계정 잠금이 해제되었습니다.",
        });

        setTimeout(() => {
            navigate("/member?tab=login");
        }, 1200);

        } catch (e) {
            setUnlockMsg({
                type: "err",
                text: e.response?.data?.message || "계정 잠금 해제에 실패했습니다.",
            });
        }
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

            {/* 이메일 + 인증번호 발송 */}
            <div className="field">
                <label>이메일</label>

                <div className="field-group">
                    <input
                        type="email"
                        name="memberId"
                        value={form.memberId}
                        onChange={handleChange}
                        disabled={isMailSent && resendCooldown > 0}
                    />

                    <button
                        type="button"
                        className="ghost-btn"
                        onClick={handleSendMail}
                        disabled={isVerified || resendCooldown > 0 || isSendingMail}
                    >
                    {isSendingMail
                        ? "발송 중..."
                        : resendCooldown > 0
                        ? `재발송 (${resendCooldown}초)`
                        : isMailSent
                        ? "재발송"
                        : "인증번호 발송"}
                    </button>
                </div>

                {/* 이메일 관련 메시지는 여기 */}
                {mailMsg && (
                    <div className={`inline-msg ${mailMsg.type}`}>
                    {mailMsg.text}
                    </div>
                )}
            </div>

            {/* 인증번호 입력 */}
            {isMailSent && (
                <div className="field">
                    <label>인증번호</label>

                    {/* 🔹 input + 버튼을 같은 줄로 */}
                    <div className="field-group">
                    <div className="auth-input-wrap" style={{ flex: 1 }}>
                        <input
                        type="text"
                        name="authCode"
                        value={form.authCode}
                        onChange={handleChange}
                        maxLength={6}
                        disabled={isVerified}
                        />

                        {!isVerified && timer > 0 && (
                        <span className="auth-timer-inline">
                            {formatMMSS(timer)}
                        </span>
                        )}
                    </div>

                    <button
                        type="button"
                        className="ghost-btn"
                        onClick={handleVerifyCode}
                        disabled={!authCodeOk || isVerified}
                    >
                        인증 확인
                    </button>
                    </div>

                    {/* 🔹 인증번호 관련 메시지는 input 아래 */}
                    {authMsg && (
                    <div className={`inline-msg ${authMsg.type}`}>
                        {authMsg.text}
                    </div>
                    )}
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

            {/* 잠금 해제 버튼 */}
            <button
                type="button"
                className="primary-btn"
                disabled={!isVerified || !pwRuleOk || !pwMatchOk}
                onClick={handleUnlock}
            >
            비밀번호 변경 및 잠금 해제
            </button>

            {/* 최종 결과 메시지는 버튼 바로 아래 */}
            {unlockMsg && (
            <div
                className={`inline-msg ${unlockMsg.type}`}
                style={{ marginTop: "12px" }}
            >
                {unlockMsg.text}
            </div>
            )}
        </form>
        </div>
    </div>
    );
}

export default UnlockTab;

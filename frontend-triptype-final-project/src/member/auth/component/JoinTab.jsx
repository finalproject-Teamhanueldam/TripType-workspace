import { useState, useMemo, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import AuthDateInput from "../../../common/component/AuthDateInput";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function JoinTab() {
  const navigate = useNavigate();

  /* =======================
     state
  ======================= */
  const [form, setForm] = useState({
    memberId: "",
    memberPassword: "",
    passwordConfirm: "",
    memberName: "",
    memberBirthDate: null,
    memberGender: "",
    memberPhone: "",
    authCode: "",
    surveyComplete: false
  });

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // 이메일 상태는 "서버 판단"만 반영
  const [emailStatus, setEmailStatus] = useState(null);
  // null | { type: "ok" | "err", text: string }

  const [serverMsg, setServerMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 타이머 (초 단위)
  const [authTimer, setAuthTimer] = useState(0);      // 5분
  const [resendCooldown, setResendCooldown] = useState(0); // 30초

   // 인증번호 5분 타이머
  useEffect(() => {
    if (authTimer <= 0) return; // 타이머 끝나면 자동 정지

    const interval = setInterval(() => { // setInterval 1초마다 실행
      setAuthTimer(prev => prev - 1); // 이전 값에서 1초 줄임
    }, 1000); // 1000은 1초(1000밀리초를 의미), 1초마다 authTimer를 1 줄여라

    return () => clearInterval(interval);
    // useEffect는 authTimer가 바뀔 때마다 다시 실행됨
    // 그때마다 interval을 새로 만들면
    // 시계가 여러 개 동시에 돌아감
    // 그래서 이전 interval 제거, 항상 하나의 타이머만 유지

  }, [authTimer]); // authTimer 값이 바뀔 때마다 이 useEffect를 다시 실행
  // authTimer = 300
  // useEffect 실행
  // 1초 후 authTimer = 299
  // authTimer 바뀜
  // useEffect 다시 실행
  // 이전 interval 제거
  // 새 interval 생성

  // 재발송 30초 쿨타임
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const interval = setInterval(() => {
      setResendCooldown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCooldown]);

  useEffect(() => {
    if (authTimer === 0 && isEmailSent && !isEmailVerified) {
      setEmailStatus({
        type: "err",
        text: "인증 시간이 만료되었습니다. 다시 인증번호를 발송해주세요."
      });
    }
  }, [authTimer]);

  /* =======================
     validation (프론트 형식만)
  ======================= */
  const msg = useMemo(() => {
    const emailFormatOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.memberId);
    const pwOk = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[^\s]{8,16}$/.test(form.memberPassword);
    const pwMatch = form.memberPassword && form.memberPassword === form.passwordConfirm;
    const nameOk =
      /^[가-힣]{2,20}$/.test(form.memberName) ||
      /^[a-zA-Z\s]{2,20}$/.test(form.memberName);
    const phoneOk =
      !form.memberPhone ||
      /^010-\d{4}-\d{4}$/.test(form.memberPhone);

    return {
      email:
        form.memberId && !emailFormatOk
          ? { type: "err", text: "올바른 이메일 형식이 아닙니다." }
          : emailStatus,
      pw: form.memberPassword
        ? pwOk
          ? { type: "ok", text: "안전한 비밀번호입니다." }
          : { type: "err", text: "영문+숫자+특수문자 포함 8~16자" }
        : null,
      pw2: form.passwordConfirm
        ? pwMatch
          ? { type: "ok", text: "비밀번호가 일치합니다." }
          : { type: "err", text: "비밀번호가 일치하지 않습니다." }
        : null,
      name: form.memberName
        ? nameOk
          ? { type: "ok", text: "유효한 이름입니다." }
          : { type: "err", text: "한글 2자 이상 또는 영문 이름" }
        : null,
      phone:
        form.memberPhone && !phoneOk
          ? { type: "err", text: "010-XXXX-XXXX 형식" }
          : null,
      auth:
        isAuthChecked
          ? isEmailVerified
            ? { type: "ok", text: "인증되었습니다." }
            : { type: "err", text: "인증번호를 확인해주세요." }
          : null
    };
  }, [form, emailStatus, isAuthChecked, isEmailVerified]);

  /* =======================
     handlers
  ======================= */
  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === "memberId") {
      setEmailStatus(null);
      setIsEmailSent(false);
      setIsEmailVerified(false);
      setIsAuthChecked(false);
    }

    if (name === "authCode") {
      setIsAuthChecked(false);
    }

    setServerMsg(null);
    setForm({ ...form, [name]: value });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const result =
      value.length < 4
        ? value
        : value.length < 8
        ? `${value.slice(0, 3)}-${value.slice(3)}`
        : `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;

    setForm({ ...form, memberPhone: result });
  };

  /* =======================
     email auth
  ======================= */
  const sendAuthCode = async () => {
    const emailFormatOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.memberId);
    if (!emailFormatOk) {
      setEmailStatus({ type: "err", text: "올바른 이메일 형식이 아닙니다." });
      return;
    }

    try {
      setIsSending(true);
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/mail/auth/send`,
        null,
        { params: { email: form.memberId } }
      );

      setEmailStatus({
        type: "ok",
        text: "사용 가능한 이메일입니다. 인증번호를 확인해주세요."
      });
      setIsEmailSent(true);

      setAuthTimer(300);       // 5분 타이머 시작
      setResendCooldown(30);   // 재발송 쿨타임 30초

    } catch (err) {
      setEmailStatus({
        type: "err",
        text:
          err?.response?.data?.message ||
          "이미 가입된 이메일입니다."
      });
    } finally {
      setIsSending(false);
    }
  };

  const verifyAuthCode = async () => {
    setIsAuthChecked(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/mail/auth/verify`,
        {
          email: form.memberId,
          authCode: form.authCode
        }
      );

      setIsEmailVerified(true);
      setEmailStatus({ type: "ok", text: "이메일 인증이 완료되었습니다." });

    } catch {
      setIsEmailVerified(false);
    }
  };

  /* =======================
     submit
  ======================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg(null);

    if (!isEmailVerified) {
      setServerMsg({ type: "err", text: "이메일 인증을 완료해주세요." });
      return;
    }

    const birth = form.memberBirthDate;
    const payload = {
      memberId: form.memberId,
      memberPassword: form.memberPassword,
      memberName: form.memberName,
      memberBirthDate: `${birth.getFullYear()}-${String(
        birth.getMonth() + 1
      ).padStart(2, "0")}-${String(birth.getDate()).padStart(2, "0")}`,
      memberGender: form.memberGender,
      memberPhone: form.memberPhone.replaceAll("-", ""),
      authCode: form.authCode
    };

    try {
      setIsSubmitting(true);
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/member/join`,
        payload
      );

      setServerMsg({ type: "ok", text: "회원가입이 완료되었습니다." });
      setTimeout(() => navigate("/member?tab=login"), 1500);

    } catch (err) {
      setServerMsg({
        type: "err",
        text: err?.response?.data?.message || "회원가입 실패"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =======================
     render
  ======================= */
  return (
    <form className="auth-form join" onSubmit={handleSubmit}>
      <div className="field">
        <label>이메일</label>
        <div className="field-group">
          <input
            type="email"
            name="memberId"
            value={form.memberId}
            onChange={onChange}
            disabled={isEmailSent}
            placeholder="example@email.com"
          />
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
                : isEmailSent
                  ? `재발송 (${resendCooldown}초)`
                  : "인증번호 발송"}
          </button>
        </div>
        
        {msg.email && (
          <div className={`inline-msg ${msg.email.type}`}>
            {msg.email.text}
          </div>
        )}
      </div>

      {isEmailSent && (
        <div className="field">
          <label>인증번호</label>
          <div className="field-group auth-code-group">
            <input
              type="text"
              name="authCode"
              value={form.authCode}
              onChange={onChange}
              disabled={isEmailVerified}
            />
            <button type="button" className="ghost-btn" onClick={verifyAuthCode}>
              확인
            </button>
            {/* 확인 버튼 바로 아래 타이머 */}
            {isEmailSent && !isEmailVerified && authTimer > 0 && (
              <div className="auth-timer-below">
                {Math.floor(authTimer / 60)}:
                {String(authTimer % 60).padStart(2, "0")}
              </div>
            )}
          </div>

          {msg.auth && (
            <div className={`inline-msg ${msg.auth.type}`}>
              {msg.auth.text}
            </div>
          )}
        </div>
      )}

      <div className="field">
        <label>비밀번호</label>
        <input type="password"
               name="memberPassword"
               value={form.memberPassword}
               onChange={onChange}
               placeholder="영문, 숫자, 특수문자 포함 8-16자"
        />
        {msg.pw && <div className={`inline-msg ${msg.pw.type}`}>{msg.pw.text}</div>}
      </div>

      <div className="field">
        <label>비밀번호 확인</label>
        <input type="password" name="passwordConfirm" value={form.passwordConfirm} onChange={onChange} placeholder="비밀번호 재입력" />
        {msg.pw2 && <div className={`inline-msg ${msg.pw2.type}`}>{msg.pw2.text}</div>}
      </div>

      <div className="field">
        <label>이름</label>
        <input type="text" name="memberName" value={form.memberName} onChange={onChange} placeholder="실명 입력 (한글/영문)" />
        {msg.name && <div className={`inline-msg ${msg.name.type}`}>{msg.name.text}</div>}
      </div>

      <div className="field">
        <label>생년월일</label>
        <DatePicker
          selected={form.memberBirthDate}
          onChange={(date) => setForm(prev => ({ ...prev, memberBirthDate: date }))}
          locale={ko}
          dateFormat="yyyy-MM-dd"
          maxDate={new Date()}
          showYearDropdown
          dropdownMode="select"
          placeholderText="날짜 선택"
          shouldCloseOnSelect
          customInput={<AuthDateInput />} // className 도 여기 들어있다.
        />
      </div>
      
      <div className="field">
        <label>성별</label>
        <div className="gender-selection">
          <label><input type="radio" name="memberGender" value="M" onChange={onChange} /> 남성</label>
          <label><input type="radio" name="memberGender" value="F" onChange={onChange} /> 여성</label>
        </div>
      </div>

      <div className="field">
        <label>휴대폰 번호 (선택)</label>
        <input type="text" name="memberPhone" value={form.memberPhone} onChange={handlePhoneChange} placeholder="010-0000-0000" />
        {msg.phone ? (
          <div className={`inline-msg ${msg.phone.type}`}>
            {msg.phone.text}
          </div>
        ) : null}
      </div>

      <div className="field" style={{marginTop: '20px'}}>
        <label>나의 여행 스타일 (선택)</label>
        <div className={`survey-trigger-box ${form.surveyComplete ? 'completed' : ''}`} onClick={() => setIsModalOpen(true)}>
          <div className="survey-status">
            <span className="icon">{form.surveyComplete ? '✅' : '🔍'}</span>
            <div>
              <p className="main-text">{form.surveyComplete ? "설문 완료!" : "내 여행 취향 분석하기"}</p>
              <p className="sub-text">{form.surveyComplete ? "취향에 맞는 여행지를 골라드릴게요." : "1분이면 끝나요! (클릭하여 시작)"}</p>
            </div>
          </div>
        </div>
      </div>

      <button type="submit" className="primary-btn" disabled={isSubmitting}>
        {isSubmitting ? "처리 중..." : "트립타임 시작하기"}
      </button>
      
      {/* 서버 메시지 인라인 표시 (원하는 위치로 옮겨도 됨) */}
      {serverMsg && (
        <div className={`inline-msg ${serverMsg.type}`} style={{ marginBottom: "12px" }}>
          {serverMsg.text}
        </div>
      )}
      
      {isModalOpen && (
        <div className="fullscreen-overlay">
          <div className="overlay-content">
            <button className="close-overlay" onClick={() => setIsModalOpen(false)}>✕</button>
            {/* 추후 overlay-body 부분 영재님 컴포넌트로 대체 */}
            <div className="overlay-body">
              <h2>여행 스타일 분석</h2>
              <p>어떤 여행을 선호하시나요?</p>
              <div className="survey-options">
                <button type="button" onClick={() => { setForm({...form, surveyComplete: true}); setIsModalOpen(false); }}>🏔️ 휴양지</button>
                <button type="button" onClick={() => { setForm({...form, surveyComplete: true}); setIsModalOpen(false); }}>🏙️ 도심관광</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

export default JoinTab;
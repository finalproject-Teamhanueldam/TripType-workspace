import { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";

function JoinTab() {
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
  const [isAuthChecked, setIsAuthChecked] = useState(false); // 확인 버튼 클릭 여부 추가
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);

  // 실시간 유효성 검사
  const msg = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.memberId);
    const pwOk = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[^\s]{8,16}$/.test(form.memberPassword);
    const pwMatch = form.memberPassword && form.memberPassword === form.passwordConfirm;
    const nameOk = /^[가-힣]{2,20}$/.test(form.memberName) || /^[a-zA-Z\s]{2,20}$/.test(form.memberName);
    
    // 인증번호 로직
    const authCodeOk = form.authCode === "123456";

    let emailMsg = null;
    if (form.memberId) {
      emailMsg = emailOk 
        ? { type: "ok", text: "사용 가능한 이메일입니다." } 
        : { type: "err", text: "올바른 이메일 형식이 아닙니다." };
    } else if (isEmailSubmitted) {
      emailMsg = { type: "err", text: "이메일을 입력해주세요." };
    }

    // 인증번호 메시지: 확인 버튼(isAuthChecked)을 눌렀을 때만 표시
    let authMsg = null;
    if (isAuthChecked) {
      if (isEmailVerified) {
        authMsg = { type: "ok", text: "인증되었습니다." };
      } else {
        authMsg = authCodeOk 
          ? { type: "ok", text: "인증번호가 일치합니다. 확인을 눌러주세요." } // 사실상 클릭 후엔 바로 위 '인증되었습니다'로 갈 확률이 높음
          : { type: "err", text: "인증번호 6자리를 확인해주세요." };
      }
    }

    return {
      email: emailMsg,
      pw: form.memberPassword ? (pwOk ? { type: "ok", text: "안전한 비밀번호입니다." } : { type: "err", text: "영문+숫자+특수문자 포함 8-16자" }) : null,
      pw2: form.passwordConfirm ? (pwMatch ? { type: "ok", text: "비밀번호가 일치합니다." } : { type: "err", text: "비밀번호가 일치하지 않습니다." }) : null,
      name: form.memberName ? (nameOk ? { type: "ok", text: "유효한 이름입니다." } : { type: "err", text: "한글 2자 이상 또는 영문 이름을 입력해주세요." }) : null,
      auth: authMsg // 가공된 authMsg 할당
    };
  }, [form, isEmailVerified, isEmailSubmitted, isAuthChecked]); // 의존성에 isAuthChecked 추가

  const onChange = (e) => {
    const { name, value } = e.target;
    // 인증번호를 수정하면 다시 확인 버튼을 누르도록 상태 초기화
    if (name === "authCode") {
      setIsAuthChecked(false);
    }
    setForm({ ...form, [name]: value });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    let result = value.length < 4 ? value : value.length < 8 ? `${value.substr(0, 3)}-${value.substr(3)}` : `${value.substr(0, 3)}-${value.substr(3, 4)}-${value.substr(7, 4)}`;
    setForm({ ...form, memberPhone: result.slice(0, 13) });
  };

  const sendAuthCode = () => {
    setIsEmailSubmitted(true);
    if (!form.memberId || (msg.email && msg.email.type === 'err')) return; 
    setIsEmailSent(true);
    setIsAuthChecked(false); // 재발송 시 체크 상태 초기화
  };

  const verifyAuthCode = () => {
    setIsAuthChecked(true); // 버튼 클릭 시점에 메시지 활성화
    if (form.authCode === "123456") {
      setIsEmailVerified(true);
    }
  };

  return (
    <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
      {/* 이메일 & 인증번호 */}
      <div className="field">
        <label>이메일</label>
        <div className="field-group">
          <input type="email" name="memberId" value={form.memberId} onChange={onChange} placeholder="example@email.com" disabled={isEmailVerified} />
          <button type="button" className="ghost-btn" onClick={sendAuthCode} disabled={isEmailVerified}>
            {isEmailSent ? "재발송" : "인증번호 발송"}
          </button>
        </div>
        {msg.email && <div className={`inline-msg ${msg.email.type}`}>{msg.email.text}</div>}

        {/* 인증번호 확인 영역 */}
        {isEmailSent && (
          <div style={{ marginTop: '18px' }}>
            <label>인증번호 확인</label>
            <div className="field-group">
              <input
                type="text"
                name="authCode"
                value={form.authCode}
                onChange={onChange}
                placeholder="인증번호 6자리"
                disabled={isEmailVerified}
              />
              <button 
                type="button"
                className={`ghost-btn ${isEmailVerified ? 'verify' : ''}`}
                onClick={verifyAuthCode}
                disabled={isEmailVerified}
              >
                {isEmailVerified ? "인증 완료" : "확인"}
              </button>
            </div>
            {/* 확인 버튼을 누른 후에만 메시지 출력 */}
            {msg.auth && <div className={`inline-msg ${msg.auth.type}`}>{msg.auth.text}</div>}
          </div>
        )}
      </div>

      <div className="field">
        <label>비밀번호</label>
        <input type="password" name="memberPassword" value={form.memberPassword} onChange={onChange} placeholder="영문, 숫자, 특수문자 포함 8-16자" />
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
          onChange={(date) => setForm({ ...form, memberBirthDate: date })}
          locale={ko} dateFormat="yyyy-MM-dd"
          className="date-input" maxDate={new Date()}
          showYearDropdown dropdownMode="select"
          placeholderText="날짜 선택"
          readOnly
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

      <button type="submit" className="primary-btn">트립타임 시작하기</button>

      {isModalOpen && (
        <div className="fullscreen-overlay">
          <div className="overlay-content">
            <button className="close-overlay" onClick={() => setIsModalOpen(false)}>✕</button>
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
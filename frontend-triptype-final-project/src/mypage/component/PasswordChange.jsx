import { useState, useMemo } from "react";
import axios from "axios";

import MyPageSectionTitle from "../common/component/MyPageSectionTitle";
import "../css/PasswordChange.css";
import "../css/MyPageCommon.css";

function PasswordChange() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    passwordConfirm: ""
  });

  const [submitMsg, setSubmitMsg] = useState(null);

  /* ======================
     실시간 유효성
  ====================== */
  const msg = useMemo(() => {
    const pwOk =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[^\s]{8,16}$/.test(
        form.newPassword
      );

    const pwMatch =
      form.newPassword &&
      form.newPassword === form.passwordConfirm;

    return {
      newPassword: form.newPassword
        ? pwOk
          ? { type: "ok", text: "사용 가능한 비밀번호입니다." }
          : {
              type: "error",
              text: "영문·숫자·특수문자 포함 8~16자"
            }
        : null,

      passwordConfirm: form.passwordConfirm
        ? pwMatch
          ? { type: "ok", text: "비밀번호가 일치합니다." }
          : { type: "error", text: "비밀번호가 일치하지 않습니다." }
        : null
    };
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setSubmitMsg(null);
  };

  /* ======================
     변경 요청
  ====================== */
  const handleSubmit = async () => {
    if (!msg.newPassword || msg.newPassword.type === "error") {
      setSubmitMsg({
        type: "error",
        text: "새 비밀번호 형식을 확인해주세요."
      });
      return;
    }

    if (!msg.passwordConfirm || msg.passwordConfirm.type === "error") {
      setSubmitMsg({
        type: "error",
        text: "비밀번호 확인이 일치하지 않습니다."
      });
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/api/mypage/password`,
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        }
      );

      setSubmitMsg({
        type: "ok",
        text: "비밀번호가 변경되었습니다. 다시 로그인해주세요."
      });

       // ⏱️ 메시지 잠깐 보여준 뒤 로그아웃
      setTimeout(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("memberName");
        localStorage.removeItem("memberId");
        localStorage.removeItem("role");

        window.location.href = "/member?tab=login";
      }, 1500);

    } catch (e) {
        const code = e.response?.data?.message;

        let text = "현재 비밀번호가 올바르지 않습니다.";

        if (code === "SAME_PASSWORD") {
          text = "기존 비밀번호와 다른 비밀번호를 입력해주세요.";
        }

        setSubmitMsg({
          type: "error",
          text
        });
    }
  };

  return (
    <div className="mypage-page">
      <MyPageSectionTitle title="비밀번호 변경" />

      <div className="mypage-card">
        <div className="pw-form">

          <div className="field">
            <label>현재 비밀번호</label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>새 비밀번호</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
            />
            {msg.newPassword && (
              <p className={`msg ${msg.newPassword.type}`}>
                {msg.newPassword.text}
              </p>
            )}
          </div>

          <div className="field">
            <label>새 비밀번호 확인</label>
            <input
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
            />
            {msg.passwordConfirm && (
              <p className={`msg ${msg.passwordConfirm.type}`}>
                {msg.passwordConfirm.text}
              </p>
            )}
          </div>

          <div className="btn-row">
            <button className="primary-btn" onClick={handleSubmit}>
              변경하기
            </button>

            {submitMsg && (
                <p className={`msg ${submitMsg.type}`}>
                    {submitMsg.text}
                </p>
            )}
          </div>

          
        </div>
      </div>
    </div>
  );
}

export default PasswordChange;

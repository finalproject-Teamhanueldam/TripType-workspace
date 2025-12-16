import { useState } from "react";

function JoinTab() {
  const [joinForm, setJoinForm] = useState({
    memberId: "",
    memberPassword: "",
    passwordConfirm: "",
    memberName: "",
    memberBirthDate: "",
    memberGender: "",
    memberPhone: ""
  });

  const handleChange = e => {
    setJoinForm({
      ...joinForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (joinForm.memberPassword !== joinForm.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    console.log("회원가입 요청:", joinForm);
    // TODO: axios.post("/member/join", joinForm)
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <input
        type="email"
        name="memberId"
        placeholder="이메일"
        value={joinForm.memberId}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="memberPassword"
        placeholder="비밀번호"
        value={joinForm.memberPassword}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="passwordConfirm"
        placeholder="비밀번호 확인"
        value={joinForm.passwordConfirm}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="memberName"
        placeholder="이름"
        value={joinForm.memberName}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="memberBirthDate"
        value={joinForm.memberBirthDate}
        onChange={handleChange}
        required
      />

      <div className="gender-box">
        <label>
          <input
            type="radio"
            name="memberGender"
            value="M"
            onChange={handleChange}
            required
          />
          남
        </label>
        <label>
          <input
            type="radio"
            name="memberGender"
            value="F"
            onChange={handleChange}
            required
          />
          여
        </label>
      </div>

      <input
        type="text"
        name="memberPhone"
        placeholder="휴대폰 번호"
        value={joinForm.memberPhone}
        onChange={handleChange}
      />

      <button type="submit">회원가입</button>
    </form>
  );
}

export default JoinTab;
function FindPasswordTab() {
  return (
    <form>
      <input type="email" placeholder="이메일" />
      <button>인증번호 발송</button>

      <input type="text" placeholder="인증번호" />
      <button>인증 확인</button>

      <input type="password" placeholder="새 비밀번호" />
      <button>비밀번호 변경</button>
    </form>
  );
}

export default FindPasswordTab;
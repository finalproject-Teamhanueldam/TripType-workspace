import { useState } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/AuthContainer.css";
import AuthDateInput from "../../../../common/component/AuthDateInput";
import axios from "axios";

function FindIdTab() {
  const [info, setInfo] = useState({ name: "", birth: null });
  const [resultId, setResultId] = useState(null); // 찾은 아이디 저장
  const [error, setError] = useState("");

  const handleFindId = async () => {
    const yyyy = info.birth.getFullYear();
    const mm = String(info.birth.getMonth() + 1).padStart(2, "0");
    const dd = String(info.birth.getDate()).padStart(2, "0");

    try {
      const res = await axios.post(
        "http://localhost:8001/triptype/member/id/find",
        {
          memberName: info.name,
          memberBirthDate: `${yyyy}-${mm}-${dd}`
        }
      );

      const ids = res.data.memberIds;
      setResultId(ids);
      setError("");
    } catch (e) {
      setResultId(null);
      setError(
        e.response?.data?.message || "일치하는 회원 정보가 없습니다."
      );
    }
  };

  return (
    <div className="auth-form">
      {/* 결과 화면이 없을 때만 입력창 노출 */}
      {!resultId ? (
        <>
          <div className="field">
            <label>이름</label>
            <input 
              type="text" 
              placeholder="이름을 입력해주세요" 
              value={info.name}
              onChange={(e) => setInfo({...info, name: e.target.value})}
            />
          </div>
          
          <div className="field">
            <label>생년월일</label>
            <DatePicker
              selected={info.birth}
              onChange={(date) => setInfo({ ...info, birth: date })}
              locale={ko}
              dateFormat="yyyy-MM-dd"
              placeholderText="생년월일 선택"
              maxDate={new Date()}
              showYearDropdown
              dropdownMode="select"
              shouldCloseOnSelect
              customInput={<AuthDateInput />}
            />
          </div>

          {error && <div className="inline-msg err" style={{ marginBottom: "10px" }}>{error}</div>}

          <button type="button" className="primary-btn" onClick={handleFindId}>
            아이디 찾기
          </button>
        </>
      ) : (
        /* 아이디 찾기 성공 결과 화면 */
        <div className="find-result" style={{ textAlign: "center", padding: "20px 0" }}>
          <p style={{ color: "#6B7280", marginBottom: "10px" }}>입력하신 정보와 일치하는 아이디입니다.</p>
          <div style={{ 
            background: "#F3F4F6", 
            padding: "20px", 
            borderRadius: "12px", 
            fontSize: "18px", 
            fontWeight: "bold",
            color: "#111827",
            marginBottom: "20px"
          }}>
            {resultId.map((id, idx) => (
              <div key={idx}>{id}</div>
            ))}
          </div>
          <button type="button" className="primary-btn" onClick={() => window.location.href = "/member?tab=login"}>
            로그인하러 가기
          </button>
        </div>
      )}
    </div>
  );
}

export default FindIdTab;
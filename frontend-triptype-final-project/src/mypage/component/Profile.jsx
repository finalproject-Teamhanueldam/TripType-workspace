import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";

import "../css/Profile.css";

function Profile() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [saveMsg, setSaveMsg] = useState(null);

  const msg = useMemo(() => {
    const nameOk =
      /^[가-힣]{2,20}$/.test(form?.memberName || "") ||
      /^[a-zA-Z\s]{2,20}$/.test(form?.memberName || "");

    const birthOk = !!form?.memberBirthDate;

    const genderOk = form?.memberGender === "M" || form?.memberGender === "F";

    const phoneOk =
      !form?.memberPhone ||
      /^010-\d{4}-\d{4}$/.test(form.memberPhone);

    return {
      name:
        form?.memberName && !nameOk
          ? { type: "err", text: "한글 2자 이상 또는 영문 이름" }
          : null,

      birth:
        !birthOk
          ? { type: "err", text: "생년월일을 선택해주세요." }
          : null,

      gender:
        !genderOk
          ? { type: "err", text: "성별을 선택해주세요." }
          : null,

      phone:
        form?.memberPhone && !phoneOk
          ? { type: "err", text: "010-XXXX-XXXX 형식" }
          : null,
    };
  }, [form]);

  /* ======================
     내 정보 조회 (JWT 기준)
  ====================== */
  const fetchProfile = async () => {
    try {
        const res = await axios.get(
            `${API_BASE_URL}/api/mypage/profile`,
            {
                headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }
        );

        const socialConnections = [
            { provider: "NAVER", email: "rread1089@naver.com" },
            { provider: "KAKAO", email: null }
        ];

        setProfile({ ...res.data, socialConnections });
        setForm(res.data);

        } catch (error) {
            console.error("🔥 프로필 조회 실패", error);

            // 임시 확인용 (화면 안 죽게)
            setProfile({
              memberId: "불러오기 실패",
              memberCreateAt: null,
              memberLastLoginAt: null,
              socialConnections: []
            });
            setForm({});
        }
    };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ======================
     입력 핸들러
  ====================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setSaveMsg(null);
  };

  const handleBirthChange = (date) => {
    setForm(prev => ({
      ...prev,
      memberBirthDate: date
        ? date.toISOString().slice(0, 10)
        : null
    }));
    setSaveMsg(null);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    const result =
      value.length < 4
        ? value
        : value.length < 8
        ? `${value.slice(0, 3)}-${value.slice(3)}`
        : `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;

    setForm(prev => ({ ...prev, memberPhone: result }));
    setSaveMsg(null);
  };
  /* ======================
     저장
  ====================== */
  const handleSave = async () => {
    if (msg.name || msg.birth || msg.gender || msg.phone) {
      setSaveMsg({
        type: "err",
        text: "입력한 정보를 다시 확인해주세요."
      });
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/api/mypage/profile`,
        {
          memberName: form.memberName,
          memberBirthDate: form.memberBirthDate,
          memberGender: form.memberGender,
          memberPhone: form.memberPhone
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        }
      );

      setSaveMsg({ type: "ok", text: "내 정보가 수정되었습니다." });
      setTimeout(() => {
        fetchProfile();
      }, 300);

    } catch (e) {
      setSaveMsg({
        type: "err",
        text: "정보 수정에 실패했습니다. 잠시 후 다시 시도해주세요."
      });
    }
  };

  if (!profile || !form) return null;

  return (
    <div className="profile-wrap">
      <h2 className="profile-title">내 정보</h2>

      <div className="profile-card">

        {/* ===== 아이디 ===== */}
        <div className="profile-row">
          <span className="label">아이디</span>
          <span className="value">{profile.memberId}</span>
        </div>

        {/* ===== 소셜 연동 상태 ===== */}
        <div className="social-section">
          {profile.socialConnections?.map(sc => (
            <div
              key={sc.provider}
              className={`social-box ${sc.email ? "connected" : "disconnected"}`}
            >
              <span className="social-provider">
                {sc.provider === "NAVER" ? "네이버" : "카카오"}
              </span>

              {sc.email ? (
                <span className="social-email">{sc.email}</span>
              ) : (
                <span className="social-none">미연동</span>
              )}
            </div>
          ))}
        </div>

        {/* ===== 조회 전용 ===== */}
        <div className="profile-row">
          <span className="label">가입일</span>
          <span className="value">
            {profile.memberCreateAt?.replace("T", " ")}
          </span>
        </div>

        <div className="profile-row">
          <span className="label">마지막 로그인</span>
          <span className="value">
            {profile.memberLastLoginAt
              ? profile.memberLastLoginAt.replace("T", " ")
              : "기록 없음"}
          </span>
        </div>

        <hr className="divider" />

        {/* ===== 수정 가능 ===== */}
        <div className="form-row">
          <label>이름</label>
          <input
            name="memberName"
            value={form.memberName || ""}
            onChange={handleChange}
          />
          {msg.name && <div className={`inline-msg ${msg.name.type}`}>{msg.name.text}</div>}
        </div>

        <div className="form-row">
          <label>생년월일</label>
          <DatePicker
            selected={
              form.memberBirthDate
                ? new Date(form.memberBirthDate)
                : null
            }
            onChange={handleBirthChange}
            dateFormat="yyyy-MM-dd"
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            locale={ko}
            className="datepicker"
            maxDate={new Date()}
          />
          {msg.birth && <div className={`inline-msg ${msg.birth.type}`}>{msg.birth.text}</div>}
        </div>

        <div className="form-row">
          <label>성별</label>
          <select
            name="memberGender"
            value={form.memberGender || ""}
            onChange={handleChange}
          >
            <option value="">선택</option>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
          {msg.gender && <div className={`inline-msg ${msg.gender.type}`}>{msg.gender.text}</div>}
        </div>

        <div className="form-row">
          <label>전화번호</label>
          <input
            name="memberPhone"
            value={form.memberPhone || ""}
            onChange={handlePhoneChange}
            placeholder="010-0000-0000"
          />
          {msg.phone && <div className={`inline-msg ${msg.phone.type}`}>{msg.phone.text}</div>}
        </div>

        <div className="btn-area">
          <button className="primary-btn" onClick={handleSave}>
            저장
          </button>
        </div>

        {saveMsg && (
          <p className={`save-msg ${saveMsg.type}`}>
            {saveMsg.text}
          </p>
        )}
      </div>
    </div>
  );
}

export default Profile;

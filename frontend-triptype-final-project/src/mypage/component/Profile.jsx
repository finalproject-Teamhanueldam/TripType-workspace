import { useEffect, useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { formatPhone, unformatPhone } from "../../common/utils/phoneFormatter";
import "../css/Profile.css";
import api from "../../common/api/axiosInstance";
import { useOutletContext, useLocation } from "react-router-dom";

function Profile() {
  const OAUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { profile, setProfile } = useOutletContext();
  const [form, setForm] = useState(null);
  const [saveMsg, setSaveMsg] = useState(null);
  const [socialMsg, setSocialMsg] = useState(null);

  const location = useLocation();

  const SOCIAL_AVAILABLE = {
    KAKAO: true,
    NAVER: false, // 승인 전
  };

  const isOnlySocial = useMemo(() => {
    if (!profile) return false;
    return !profile.hasPassword && profile.socialConnections?.length === 1;
  }, [profile]);

  const needProfileInfo = useMemo(() => {
    if (!profile) return false;

    return (
      profile.hasPassword &&
      (!profile.memberBirthDate || !profile.memberGender)
    );
  }, [profile]);

  const msg = useMemo(() => {
    if (!form) return {};

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
     입력 핸들러
  ====================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setSaveMsg(null);
  };

  const handleSocialLink = async (providerUpper) => {
    try {
      setSocialMsg({ type: "ok", text: "소셜 연동을 시작합니다." });

      // axiosInstance 사용 (Authorization 자동 포함)
      const res = await api.get(`/api/mypage/social/link/${providerUpper.toLowerCase()}`);

      // 백엔드가 내려준 카카오 authorize URL로 이동
      window.location.href = res.data.url;
    } catch (e) {
      setSocialMsg({ type: "err", text: "소셜 연동 시작에 실패했습니다." });
    }
  };

  const handleSocialUnlink = async (providerUpper) => {
    try {
      await api.delete(`/api/mypage/social/${providerUpper}`);

      setSocialMsg({
        type: "ok",
        text: "소셜 연동이 해제되었습니다."
      });

      setProfile(prev => ({
        ...prev,
        socialConnections: prev.socialConnections.filter(
          s => s.provider !== providerUpper
        )
      })); // 상태 갱신

      setTimeout(() => setSocialMsg(null), 3000);
    } catch (e) {
      const msg = e.response?.data?.message;

      if (msg === "LAST_LOGIN_METHOD") {
        setSocialMsg({
          type: "err",
          text: "마지막 로그인 수단은 해제할 수 없습니다."
        });
        return;
      }

      if (msg === "NOT_CONNECTED") {
        setSocialMsg({
          type: "err",
          text: "이미 연동 해제된 계정입니다."
        });
        return;
      }

      setSocialMsg({
        type: "err",
        text: "소셜 연동 해제에 실패했습니다."
      });
    }
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

    const payload = {
      memberName: form.memberName,
      memberBirthDate: form.memberBirthDate,
      memberGender: form.memberGender,
      memberPhone: unformatPhone(form.memberPhone)
    };

    try {
      await api.put("/api/mypage/profile", payload);

      setProfile(prev => ({
        ...prev,
        ...payload
      }));

      setSaveMsg({ type: "ok", text: "내 정보가 수정되었습니다." });

    } catch (e) {
      setSaveMsg({
        type: "err",
        text: "정보 수정에 실패했습니다. 잠시 후 다시 시도해주세요."
      });
    }
  };

  useEffect(() => {
    if (!profile) return;

    setForm({
      ...profile,
      memberPhone: formatPhone(profile.memberPhone),
    });
  }, [profile]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const link = params.get("link");

    if (!link) return;

    if (link === "kakao-success") {
      setSocialMsg({
        type: "ok",
        text: "카카오 계정이 성공적으로 연동되었습니다."
      });
    }

    if (link === "kakao-already-linked") {
      setSocialMsg({
        type: "err",
        text: "이미 다른 회원에 연동된 카카오 계정입니다."
      });
    }

    if (link === "fail") {
      setSocialMsg({
        type: "err",
        text: "소셜 연동에 실패했습니다."
      });
    }

    // 주소 깔끔하게 (선택)
    window.history.replaceState({}, "", "/mypage");

  }, [location.search]);

  if (!profile || !form) return null;

  return (
    <div className="profile-wrap">
      <h2 className="profile-title">내 정보</h2>

      {needProfileInfo && (
        <div className="mypage-warning">
          일반 로그인을 위해 생년월일과 성별을 입력해주세요.
        </div>
      )}


      <div className="profile-card">

        {/* ===== 아이디 ===== */}
        <div className="profile-row">
          <span className="label">아이디</span>
          <span className="value">{profile.memberId}</span>
        </div>

        {/* ===== 소셜 연동 상태 ===== */}
        <div className="social-section">
          {["KAKAO", "NAVER"].map(provider => {
            const sc = profile.socialConnections?.find?.(s => s.provider === provider);
            const label = provider === "KAKAO" ? "카카오" : "네이버";
            const providerLower = provider.toLowerCase();

            return (
              <div
                key={provider}
                className={`social-box ${sc ? "connected" : "disconnected"}`}
              >
                <span className="social-provider">{label}</span>

                {sc ? (
                  <>
                    <span className="social-email">{sc.email}</span>
                    <button
                      type="button"
                      className="social-btn unlink"
                      disabled={isOnlySocial}
                      title={isOnlySocial ? "마지막 로그인 수단은 해제할 수 없습니다." : ""}
                      onClick={() => handleSocialUnlink(provider)}
                    >
                      연동 해제
                    </button>
                  </>
                ) : (
                  <>
                    <span className="social-none">미연동</span>
                    <button
                      type="button"
                      className="social-btn link"
                      disabled={!SOCIAL_AVAILABLE[provider]}
                      title={
                        !SOCIAL_AVAILABLE[provider]
                          ? "현재 네이버 로그인은 준비 중입니다."
                          : ""
                      }
                      onClick={() => handleSocialLink(provider)}
                    >
                      연동하기
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {socialMsg && (
          <p className={`save-msg ${socialMsg.type}`}>
            {socialMsg.text}
          </p>
        )}

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

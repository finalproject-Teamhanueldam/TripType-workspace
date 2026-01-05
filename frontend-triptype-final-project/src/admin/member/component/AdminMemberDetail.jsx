import "../css/AdminMemberDetail.css";
import "../css/AdminMemberCommon.css";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminMemberDetail() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { memberNo } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [message, setMessage] = useState("");

  const formatDateTime = (value) => {
    if (!value) return "-";
    return value.replace("T", " ").slice(0, 16);
  };

  const formatDateOnly = (value) => {
    if (!value) return "-";
    return value.toString().slice(0, 10);
  };

  useEffect(() => {
   axios
    .get(`${API_BASE_URL}/admin/member/${memberNo}`, {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
    })
    .then(res => setMember(res.data.member))
    .catch(() => {
        setMessage("회원 정보를 불러올 수 없습니다.");
    });
  }, [memberNo]);

  /* ===== 관리자 액션 ===== */
  const unlockAccount = async () => {
    await axios.put(
      `${API_BASE_URL}/admin/member/unlock`,
      { memberNos: [Number(memberNo)] }
    );

    setMember(prev => ({ ...prev, memberIsLocked: "N" }));
    setMessage("계정 잠금이 해제되었습니다.");
  };

  const deactivateAccount = async () => {
    try{
      await axios.put(
        `${API_BASE_URL}/admin/member/deactivate`,
        { memberNos: [Number(memberNo)] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        }
      );

      setMember(prev => ({ ...prev, memberIsActive: "N" }));
      setMessage("계정이 비활성화되었습니다.");
    } catch (err){
      const serverMessage =
        err.response?.data?.message ||
        "관리자 계정은 비활성화할 수 없습니다.";

        setMessage(serverMessage);
    }
  };

  if (!member) {
    return <div className="admin-page">로딩 중...</div>;
  }

  return (
    <div className="admin-page">
      <h2 className="page-title">회원 상세</h2>

      <section className="detail-card">
        <h3>기본 정보</h3>

        <div className="detail-grid">
          <div><span>이메일</span>{member.memberId}</div>
          <div><span>이름</span>{member.memberName}</div>
          <div><span>권한</span>{member.memberRole}</div>
          <div><span>생년월일</span>{formatDateOnly(member.memberBirthDate)}</div>
          <div><span>전화번호</span>{member.memberPhone || "-"}</div>
          <div><span>가입일</span>{formatDateTime(member.memberCreateAt)}</div>
          <div><span>최근 로그인</span>{formatDateTime(member.memberLastLoginAt)}</div>
        </div>
      </section>

      <section className="detail-card">
        <h3>계정 상태</h3>

        <div className="detail-grid">
          <div>
            <span>활성 상태</span>
            {member.memberIsActive === "Y" ? "활성" : "비활성"}
          </div>

          <div>
            <span>잠금 상태</span>
            {member.memberIsLocked === "Y" ? "잠김" : "정상"}
          </div>
        </div>
      </section>

      <section className="detail-card">
        <h3>관리자 액션</h3>

        <div className="action-buttons">
          {member.memberIsLocked === "Y" && (
            <button className="btn btn-outline" onClick={unlockAccount}>
              잠금 해제
            </button>
          )}

          {member.memberIsActive === "Y" && (
            <button className="btn btn-danger" onClick={deactivateAccount}>
              계정 비활성화
            </button>
          )}

          <button className="btn" onClick={() => navigate("/admin/member")}>
            목록으로
          </button>
        </div>

        {message && (
          <p className={`inline-message ${message.includes("비활성화") ? "error" : ""}`}>
            {message}
          </p>
        )}
      </section>
    </div>
  );
}

export default AdminMemberDetail;

import "../css/AdminMemberList.css";
import "../css/AdminMemberCommon.css";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminMemberList() {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [checked, setChecked] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [manageMode, setManageMode] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /* =========================
     데이터 로딩 (백엔드 연동)
  ========================= */
  useEffect(() => {
    axios.get(`${API_BASE_URL}/admin/member`, {
      params: {
        keyword,
        showInactive
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then(res => {
      setMembers(res.data.list ?? []);
    }).catch(console.error);
  }, [keyword, showInactive]);

  /* =========================
     체크 처리
  ========================= */
  const toggleOne = (memberNo) => {
    setChecked(prev =>
      prev.includes(memberNo)
        ? prev.filter(v => v !== memberNo)
        : [...prev, memberNo]
    );
  };

  /* =========================
     관리자 액션
  ========================= */
  const unlockSelected = async () => {
    if (checked.length === 0) return;

    await axios.put(
      `${API_BASE_URL}/admin/member/unlock`,
      { memberNos: checked }
    );

    setChecked([]);
    setManageMode(false);
  };

  const deactivateSelected = async () => {
    if (checked.length === 0) return;

    await axios.put(
      `${API_BASE_URL}/admin/member/deactivate`,
      { memberNos: checked }
    );

    setChecked([]);
    setManageMode(false);
  };

  return (
    <div className="admin-page">
      <h2 className="page-title">회원 관리</h2>

      <div className="admin-controls">
        <div className="left">
          <input
            className="search-input"
            placeholder="이메일 또는 이름 검색"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />

          <button
            className={`filter-toggle ${showInactive ? "active" : ""}`}
            onClick={() => setShowInactive(!showInactive)}
          >
            비활성 회원 포함
          </button>
        </div>

        <div className="right">
          <button
            className={`btn btn-ghost ${manageMode ? "active" : ""}`}
            onClick={() => {
              setManageMode(!manageMode);
              setChecked([]);
            }}
          >
            관리 모드
          </button>
        </div>
      </div>

      <div className={`member-table ${manageMode ? "manage-mode" : ""}`}>
        <div className="member-row header">
          <span>No</span>
          <span>이메일</span>
          <span>이름</span>
          <span>권한</span>
          <span>활성</span>
          <span>잠금</span>
        </div>

        {members.length === 0 && (
          <div className="empty-row">회원이 없습니다.</div>
        )}

        {members.map(m => (
          <div
            key={m.memberNo}
            className="member-row"
            onClick={() => {
              if (manageMode) {
                toggleOne(m.memberNo);
              } else {
                navigate(`/admin/member/${m.memberNo}`);
              }
            }}
          >
            <span>{m.memberNo}</span>
            <span>{m.memberId}</span>
            <span>{m.memberName}</span>
            <span>{m.memberRole}</span>
            <span className={m.memberIsActive === "Y"
                ? "member-status-active"
                : "member-status-inactive"}>
                {m.memberIsActive === "Y" ? "활성" : "비활성"}
            </span>

            <span className={m.memberIsLocked === "Y"
                ? "member-status-locked"
                : ""}>
                {m.memberIsLocked === "Y" ? "잠김" : "정상"}
            </span>

            {manageMode && (
              <span
                className="check-col"
                onClick={e => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={checked.includes(m.memberNo)}
                  onChange={() => toggleOne(m.memberNo)}
                />
              </span>
            )}
          </div>
        ))}
      </div>

      {manageMode && (
        <div className="manage-floating-bar">
          <span>선택 {checked.length}명</span>

          <button className="btn btn-outline" onClick={unlockSelected}>
            잠금 해제
          </button>

          <button className="btn btn-danger" onClick={deactivateSelected}>
            비활성화
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminMemberList;

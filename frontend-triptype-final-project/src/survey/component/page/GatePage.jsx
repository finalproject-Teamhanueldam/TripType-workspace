// src/survey/page/GatePage.jsx
import "../../css/page/GatePage.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../common/api/axiosInstance.js";
import { toast } from "react-toastify";

const GatePage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);
  const [surveyData, setSurveyData] = useState(null); // 기존 결과(있다면)

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("로그인 후 이용 가능합니다.");
      navigate("/member?tab=login");
      return;
    }

    const fetchSurvey = async () => {
      try {
        const res = await api.get("/api/survey/me");

        setExists(!!res?.data?.exists);
        setSurveyData(res?.data?.data ?? null);
      } catch (e) {
        console.error(e);
        setExists(false);
        setSurveyData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [navigate]);

  if (loading) {
    return <div className="surveyGateWrap">로딩중...</div>;
  }

  // ✅ 처음 유저 (기존 결과 없음)
  if (!exists) {
    return (
      <div className="surveyGateWrap">
        <div className="surveyGateCard">
          <h2 className="surveyGateTitle">취향 설문</h2>
          <p className="surveyGateDesc">
            간단한 설문으로 여행 취향을 파악하고 맞춤 추천을 받아보세요.
          </p>

          <div className="surveyGateActions">
            <button
              type="button"
              className="surveyGateBtn primary"
              onClick={() => {
                // ✅ 요구사항: 시작하기를 누르면 무조건 "처음부터" 시작해야 함
                navigate("/survey/question", { state: { startFresh: true } });
              }}
            >
              설문 시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ 이미 설문 했던 유저
  return (
    <div className="surveyGateWrap">
      <div className="surveyGateCard">
        <h2 className="surveyGateTitle">취향 설문</h2>
        <p className="surveyGateDesc">
          이전에 완료한 설문 결과가 있습니다. 새로 진행할까요?
        </p>

        <div className="surveyGateActions">
          <button
            type="button"
            className="surveyGateBtn ghost"
            onClick={() => {
              // 결과는 마이페이지 설문 결과로 이동시키는 게 정확함
              navigate("/mypage/survey");
            }}
          >
            결과 보기
          </button>

          <button
            type="button"
            className="surveyGateBtn primary"
            onClick={() => {
              // ✅ 요구사항: 새로하기를 누르면 무조건 "처음부터" 시작해야 함
              navigate("/survey/question", { state: { startFresh: true } });
            }}
          >
            새로 하기
          </button>
        </div>

        <div className="surveyGateHint">
          결과는 마이페이지에서도 확인할 수 있습니다.
        </div>
      </div>
    </div>
  );
};

export default GatePage;

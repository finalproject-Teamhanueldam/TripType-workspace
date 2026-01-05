import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function OAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    const params = new URLSearchParams(location.search);
    // link 모드면 여기 오면 안 됨
    if (params.get("linked") === "true") {
      navigate("/mypage");
      return;
    }
    
    const token = params.get("token");

    if (!token) {
      navigate("/member?tab=login");
      return;
    }

    const fetchMe = async () => {
      try {
        localStorage.clear();
        const res = await axios.get(
          `${API_BASE_URL}/api/member/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // 여기서만 세션 갱신
        localStorage.setItem("accessToken", token);
        localStorage.setItem("memberName", res.data.memberName);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("memberId", res.data.memberId);

        window.dispatchEvent(new Event("loginChanged"));
        navigate("/");
      } catch (e) {
        localStorage.clear();
        navigate("/member?tab=login");
      }
    };

    fetchMe();
  }, [location, navigate]);

  return <div>로그인 처리 중...</div>;
}


export default OAuthRedirect;

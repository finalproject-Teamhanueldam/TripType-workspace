import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function OAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchMe = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");

      if (!token) {
        navigate("/member?tab=login");
        return;
      }

      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/member/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        localStorage.setItem("accessToken", token);
        localStorage.setItem("memberName", res.data.memberName);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("memberId", res.data.memberId);

        window.dispatchEvent(new Event("loginChanged"));
        navigate("/");
      } catch (e) {
        navigate("/member?tab=login");
      }
    };

    fetchMe();
  }, []);

  return <div>로그인 처리 중...</div>;
}

export default OAuthRedirect;


import axios from "axios";

// TODO : 서버에 올릴 api url은 이쪽에서 변경해야 합니다.
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const getApiBaseUrl = () => {
 if(process.env.NEXT_PUBLIC_API_BASE_URL) {
  return process.env.NEXT_PUBLIC_API_BASE_URL;
 }

 return "http://localhost:3000"
}


export const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  timeout: 15000,
});

// 쿠키에서 CSRF 토큰 읽기
function getCsrfTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "XSRF-TOKEN") {
      return decodeURIComponent(value);
    }
  }
  return null;
}

api.defaults.xsrfCookieName = "XSRF-TOKEN";
api.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const status = error?.response?.status;

    // CSRF 토큰 관련 403 에러인 경우 토큰 재발급 시도
    if (status === 403) {
      console.log("403 에러 - CSRF 토큰 재발급 시도");
      try {
        // GET 요청으로 새 CSRF 토큰 받아오기
        await axios.get("/api/v1/users-auth/me", {
          withCredentials: true,
          baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        });

        const token = getCsrfTokenFromCookie();
        if (token && error.config) {
          error.config.headers["X-XSRF-TOKEN"] = token;
          console.log("새 CSRF 토큰으로 재시도:", token);
          return api.request(error.config);
        }
      } catch (retryError) {
        console.log("CSRF 토큰 재발급 실패:", retryError);
      }
    }

    if (status === 401) {
      if (typeof window !== "undefined") {
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

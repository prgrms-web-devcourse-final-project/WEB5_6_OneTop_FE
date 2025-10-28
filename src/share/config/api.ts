import axios from "axios";

// API 베이스 URL을 환경에 따라 동적으로 설정

export const getApiBaseUrl = () => {
  // 개발 환경 판별
  const isDevelopment = process.env.NODE_ENV === "development";

  // 브라우저 환경에서 localhost 확인
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.startsWith("192.168.") ||
      window.location.hostname.endsWith(".local"));

  // 개발 환경이거나 localhost에서 실행 중인 경우
  if (isDevelopment || isLocalhost) {
    return "http://localhost:3000";
  }

  // 프로덕션 환경에서는 환경 변수 사용
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  // 기본값은 현재 호스트 기준 (fallback)
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.host}`;
  }

  // 서버 사이드에서는 기본 localhost 반환
  return "http://localhost:3000";
};

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
    if (status === 403 && !error.config._isRetry) {
      console.log("403 에러 - CSRF 토큰 재발급 시도");
      try {
        // GET 요청으로 새 CSRF 토큰 받아오기
        await axios.get("/api/v1/users-auth/me", {
          withCredentials: true,
          baseURL: getApiBaseUrl(),
        });

        const token = getCsrfTokenFromCookie();
        if (token && error.config) {
          error.config._isRetry = true;
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

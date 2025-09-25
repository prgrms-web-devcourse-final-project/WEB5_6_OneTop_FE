import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // 서브도메인 쿠키 동봉 옵션
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      if (typeof window !== "undefined") {
        // 로그인 만료 안내 후 로그인 페이지로
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

// 쿠키에서 CSRF 토큰 읽기
function getCsrfTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'XSRF-TOKEN') {
      return decodeURIComponent(value);
    }
  }
  return null;
}

// 요청 인터셉터 - CSRF 토큰 자동 추가
api.interceptors.request.use(
  async (config) => {
    // GET 요청이 아닌 경우에만 CSRF 토큰 확인
    if (config.method && config.method.toLowerCase() !== 'get') {
      // 쿠키에서 CSRF 토큰 가져오기
      let token = getCsrfTokenFromCookie();
      
      // 토큰이 없으면 먼저 GET 요청으로 토큰 받아오기
      if (!token) {
        console.log('CSRF 토큰이 없음, 먼저 가져오는 중...');
        try {
          // 아무 GET 요청이나 보내서 CSRF 토큰 쿠키 받아오기
          // /api/v1/users-auth/me 같은 기존 엔드포인트 사용
          await axios.get('/api/v1/users-auth/me', {
            withCredentials: true,
            baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
          });
          
          // 다시 쿠키에서 토큰 확인
          token = getCsrfTokenFromCookie();
          console.log('CSRF 토큰 획득:', token);
        } catch (error) {
          console.log('CSRF 토큰 가져오기 실패, 계속 진행:', error);
        }
      }
      
      // 토큰이 있으면 헤더에 추가
      if (token) {
        config.headers['X-XSRF-TOKEN'] = token;
        console.log('CSRF 토큰 헤더 추가:', token);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const status = error?.response?.status;
    
    // CSRF 토큰 관련 403 에러인 경우 토큰 재발급 시도
    if (status === 403) {
      console.log('403 에러 - CSRF 토큰 재발급 시도');
      try {
        // GET 요청으로 새 CSRF 토큰 받아오기
        await axios.get('/api/v1/users-auth/me', {
          withCredentials: true,
          baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        });
        
        const token = getCsrfTokenFromCookie();
        if (token && error.config) {
          error.config.headers['X-XSRF-TOKEN'] = token;
          console.log('새 CSRF 토큰으로 재시도:', token);
          return api.request(error.config);
        }
      } catch (retryError) {
        console.log('CSRF 토큰 재발급 실패:', retryError);
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
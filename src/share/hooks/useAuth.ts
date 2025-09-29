// 추후 api 확인 후 해당 부분 맞게 수정 필요 - 임시용

"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  email?: string;
  name: string;
  type: "guest" | "member";
}

interface UseAuthReturn {
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
  requestGuestToken: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // 먼저 현재 사용자 정보 확인
      const userResponse = await fetch("/api/v1/users-auth/me", {
        credentials: "include", // 쿠키 포함
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();

        // 백엔드가 {message: 'anonymous'} 형태로 반환하는 경우 처리
        if (userData.message === "anonymous" || !userData.type) {
          console.log("익명 사용자 감지 - 게스트 토큰 요청");
          await requestGuestToken();
        } else {
          setUser(userData);
        }
      } else {
        await requestGuestToken();
      }
    } catch (error) {
      console.error("인증 초기화 실패:", error);
      // 에러 시 게스트로 처리
      setUser({
        id: "offline-guest",
        name: "게스트 사용자",
        type: "guest",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const requestGuestToken = async () => {
    try {
      const response = await fetch("/api/v1/users-auth/guest", {
        method: "POST",
        credentials: "include", // 쿠키 포함
      });

      if (response.ok) {
        const data = await response.json();

        // 게스트 토큰 발급 성공
        if (data.user) {
          setUser(data.user);
        } else {
          // user 객체가 없으면 기본 게스트 설정
          setUser({
            id: data.id || "guest",
            name: data.name || "게스트 사용자",
            type: "guest",
          });
        }
      } else {
        // 게스트 토큰 발급 실패 시 오프라인 게스트
        setUser({
          id: "offline-guest",
          name: "게스트 사용자",
          type: "guest",
        });
      }
    } catch (error) {
      console.error("게스트 토큰 발급 실패:", error);
      setUser({
        id: "offline-guest",
        name: "게스트 사용자",
        type: "guest",
      });
    }
  };

  return {
    user,
    isGuest: user?.type === "guest",
    isLoading,
    requestGuestToken,
  };
};

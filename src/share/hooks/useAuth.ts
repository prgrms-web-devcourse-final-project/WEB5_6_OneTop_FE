// 추후 api 확인 후 해당 부분 맞게 수정 필요

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
      const userResponse = await fetch("/api/users-auth/me", {
        credentials: "include", // 쿠키 포함
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
      } else {
        // 토큰이 없거나 유효하지 않으면 게스트 토큰 발급
        await requestGuestToken();
      }
    } catch (error) {
      console.error("인증 초기화 실패:", error);
      // 에러 시에도 오프라인 게스트로 진행
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
    const response = await fetch("/api/users-auth/guest", {
      method: "POST",
      credentials: "include", // 쿠키 포함
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
    } else {
      throw new Error("게스트 토큰 발급 실패");
    }
  };

  return {
    user,
    isGuest: user?.type === "guest",
    isLoading,
    requestGuestToken,
  };
};

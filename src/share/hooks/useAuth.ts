"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import { axiosInstance } from "../utils/axios";
import { useBaselineStore } from "@/domains/baselines/stores/baselineStore";

interface User {
  id: number;
  email?: string;
  username?: string;
  role: "USER" | "GUEST" | "ADMIN";
  birthdayAt: string;
  gender?: "F" | "M";
  mbti?: string;
  createdAt?: string;
}

interface UseAuthReturn {
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
  requestGuestToken: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const { user, setUser, isGuest: isGuestFromStore } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      console.log("🔍 인증 상태 확인 중...");

      const response = await axiosInstance.get("/users-auth/me");

      console.log("인증 응답:", response.data);

      // 백엔드 응답 구조: {data: {...}, message: '...', status: 200}
      const userData = response.data.data; // data 안의 data를 확인

      // 익명 사용자 체크 (data가 없거나 id가 없는 경우)
      if (!userData || !userData.id || response.data.message === "anonymous") {
        console.log("👤 익명 사용자 - 게스트 토큰 요청");
        await requestGuestToken();
      } else {
        // 정상 사용자 정보 저장
        console.log("로그인된 사용자:", userData);
        // 로그인 사용자로 전환 시 게스트 데이터 초기화
        const { hasGuestSubmitted } = useBaselineStore.getState();
        if (hasGuestSubmitted) {
          console.log("🔄 게스트 데이터 초기화");
          useBaselineStore.getState().clearEvents();
        }

        setUser(userData);
      }
    } catch (error: unknown) {
      console.error("인증 확인 실패:", error);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await requestGuestToken();
      } else {
        setUser({
          id: Date.now(),
          role: "GUEST",
          birthdayAt: "2000-01-01",
          username: "게스트 사용자",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const requestGuestToken = async () => {
    try {
      console.log("게스트 토큰 발급 요청...");

      const response = await axiosInstance.post("/users-auth/guest");

      console.log("게스트 토큰 발급 성공:", response.data);

      // 백엔드 응답 구조 확인
      const guestData = response.data.data;

      if (guestData && guestData.id) {
        setUser(guestData);
      } else {
        // data가 없으면 기본 게스트 설정
        setUser({
          id: response.data.userId || Date.now(),
          role: "GUEST",
          birthdayAt: "2000-01-01",
          username: "게스트 사용자",
        });
      }
    } catch (error: unknown) {
      console.error("게스트 토큰 발급 실패:", error);

      setUser({
        id: Date.now(),
        role: "GUEST",
        birthdayAt: "2000-01-01",
        username: "오프라인 게스트",
      });
    }
  };

  return {
    user: user as User | null,
    isGuest: isGuestFromStore,
    isLoading,
    requestGuestToken,
  };
};

import { useState, useEffect, useRef } from "react";
import { useAuthUser } from "@/domains/auth/api/useAuthUser";
import { api } from "@/share/config/api";
import type {
  BaselineUser,
  UserInfoResponse,
  BaselineUserState,
} from "../types";

export const useBaselineUser = (): BaselineUserState => {
  const { data: authData, isLoading: authLoading } = useAuthUser();
  const [user, setUser] = useState<BaselineUser | null>(null);
  const [birthYear, setBirthYear] = useState<number | undefined>(undefined);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      if (hasFetchedRef.current || authLoading || isFetchingData) {
        return;
      }

      try {
        setIsFetchingData(true);
        hasFetchedRef.current = true;

        // 사용자 인증 정보
        const authResponse = await api.get<BaselineUser>(
          "/api/v1/users-auth/me"
        );
        if (authResponse.data) {
          setUser(authResponse.data);
        }

        // 생년월일 정보
        try {
          const infoResponse = await api.get<UserInfoResponse>(
            "/api/v1/users-info"
          );
          if (infoResponse.data?.birthdayAt) {
            const birthdayStr = infoResponse.data.birthdayAt;
            const year = parseInt(
              birthdayStr.split("-")[0] || birthdayStr.substring(0, 4)
            );
            if (!isNaN(year)) {
              setBirthYear(year);
            }
          }
        } catch (birthYearError) {
          console.warn("생년월일 조회 실패:", birthYearError);
        }
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);

        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 401) {
          }
        }
      } finally {
        setIsFetchingData(false);
      }
    };

    if (!authLoading && !user && !hasFetchedRef.current) {
      fetchUserData();
    }
  }, [authLoading]);

  const isGuest = user?.role === "GUEST";
  const isLoading = authLoading || isFetchingData;

  return { user, birthYear, isGuest, isLoading };
};

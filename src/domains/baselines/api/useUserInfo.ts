import { api } from "@/share/config/api";
import { queryKeys } from "@/share/config/queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface UserInfo {
  email: string;
  username: string;
  nickname: string;
  birthdayAt: string;
  gender: "F" | "M";
  mbti: string;
  beliefs: string;
  lifeSatis: number;
  relationship: number;
  workLifeBal: number;
  riskAvoid: number;
  updatedAt: string;
}

export const useUserInfo = () => {
  return useQuery({
    queryKey: queryKeys.user.info(),
    queryFn: async () => {
      const response = await api.get<UserInfo>("/api/v1/users-info");
      return response.data;
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    enabled: true,
  });
};

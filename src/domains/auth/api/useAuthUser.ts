import { api } from "@/share/config/api";
import { queryKeys } from "@/share/config/queryKeys";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AuthUser } from "../types";

export const useAuthUser = (useAuthUserOptions?: UseQueryOptions<AuthUser>) => {
  return useQuery<AuthUser>({
    queryKey: queryKeys.auth.me(),
    queryFn: () => api.get("/api/v1/users-auth/me"),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
    retry: 0,
    retryDelay: 1000,
    refetchOnWindowFocus: true,
    throwOnError: false, // 에러를 throw하지 않고 error 상태로 관리
    ...useAuthUserOptions,
  });
};

import { api } from "@/share/config/api";
import { queryKeys } from "@/share/config/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useAuthUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => api.get("/api/v1/users-auth/me"),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
    retry: 0,
    retryDelay: 1000,
    refetchOnWindowFocus: true,
  });
};

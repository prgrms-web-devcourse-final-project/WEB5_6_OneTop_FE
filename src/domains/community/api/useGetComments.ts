import { api, getApiBaseUrl } from "@/share/config/api";
import { queryKeys } from "@/share/config/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useGetComments({ id, page = 1, size = 30 }: { id: string, page: number, size: number }) {
  return useQuery({
    queryKey: queryKeys.comment.get(id),
    queryFn: () => api.get(`${getApiBaseUrl()}/api/v1/posts/${id}/comments?page=${page}&size=${size}`),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });
}

import { api, getApiBaseUrl } from "@/share/config/api";
import { queryKeys } from "@/share/config/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useGetComments({ id }: { id: string }) {
  return useQuery({
    queryKey: queryKeys.comment.get(id),
    queryFn: () => api.get(`${getApiBaseUrl()}/api/v1/posts/${id}/comments`),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });
}

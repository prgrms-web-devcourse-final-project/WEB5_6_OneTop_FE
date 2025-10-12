import { api } from "@/share/config/api";
import { queryKeys } from "@/share/config/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useGetPoll = (id: string) => {
  return useQuery({
    queryKey: queryKeys.poll.id(id),
    queryFn: () => api.get(`/api/v1/posts/${id}/polls`),
    enabled: !!id,
  });
};

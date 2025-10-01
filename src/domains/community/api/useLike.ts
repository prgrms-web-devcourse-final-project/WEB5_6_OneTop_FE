import { api } from "@/share/config/api";
import { queryKeys } from "@/share/config/queryKeys";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";

export function useLike({
  options,
}: {
  options: UseMutationOptions<unknown, Error, { id: string }>;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: queryKeys.post.like(),
    mutationFn: async ({ id }: { id: string }) => {
      const res = await api.post(`/api/v1/posts/${id}/likes`);
      return res.data;
    },
    onSuccess: (_, variables) => {
      const { id } = variables;

      // post 조회 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.post.id(id) });
    },
    ...options,
  });
}

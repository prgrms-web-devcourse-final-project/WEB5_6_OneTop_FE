import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/share/config/api";
import { getApiBaseUrl } from "@/share/config/api";
import { queryKeys } from "@/share/config/queryKeys";

export function useDeleteComment({
  postId,
  options = {},
}: {
  postId: string;
  options?: UseMutationOptions<unknown, Error, { commentId: string }>;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["comment", "delete"],
    mutationFn: ({ commentId }: { commentId: string }) =>
      api.delete(
        `${getApiBaseUrl()}/api/v1/posts/${postId}/comments/${commentId}`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comment.get(postId),
      });
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
  });
}

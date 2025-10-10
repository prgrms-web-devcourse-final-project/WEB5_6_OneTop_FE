import { api } from "@/share/config/api";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export const useCommnetLike = (
  options?: UseMutationOptions<
    unknown,
    Error,
    { commentId: string; postId: string }
  >
) => {
  return useMutation({
    mutationFn: ({
      commentId,
      postId,
    }: {
      commentId: string;
      postId: string;
    }) => {
      return api.post(`/api/v1/posts/${postId}/comments/${commentId}/likes`);
    },
    ...options,
  });
};

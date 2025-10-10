import { api } from "@/share/config/api";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export const useCommentUnlike = (
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
      return api.delete(`/api/v1/posts/${postId}/comments/${commentId}/likes`);
    },
    ...options,
  });
};

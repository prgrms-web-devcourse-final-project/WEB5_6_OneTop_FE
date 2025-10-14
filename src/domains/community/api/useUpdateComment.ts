import { api } from "@/share/config/api";
import { queryKeys } from "@/share/config/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateComment({ postId }: { postId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      commentId: number;
      content: string;
      hide: boolean;
    }) =>
      api.put(`/api/v1/posts/${postId}/comments/${data.commentId}`, {
        content: data.content,
        hide: data.hide,
      }),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comment.get(postId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.myComments.all() });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

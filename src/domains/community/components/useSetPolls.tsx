import { api } from "@/share/config/api";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export const useSetPolls = (options?: UseMutationOptions<unknown, Error, { choice: number[]; postId: string }, unknown>) => {
  return useMutation({
    mutationFn: ({ choice, postId }: { choice: number[]; postId: string }) => {
      return api.post(`/api/v1/posts/${postId}/polls`, { choice });
    },
    ...options,
  });
};

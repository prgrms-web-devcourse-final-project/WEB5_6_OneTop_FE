import { api } from "@/share/config/api";
import { useMutation } from "@tanstack/react-query";

export const useSetPolls = () => {
  return useMutation({
    mutationFn: ({ choice, postId }: { choice: number[]; postId: string }) => {
      return api.post(`/api/v1/posts/${postId}/polls`, { choice });
    },
  });
};

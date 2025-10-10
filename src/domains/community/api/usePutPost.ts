import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { PostDetail, PostWrite } from "../types";
import { api } from "@/share/config/api";

export const usePutPost = (id: string, options?: UseMutationOptions<PostWrite, Error, PostDetail>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostWrite) => {
      return api.put(`/api/v1/posts/${id}`, data) as Promise<PostWrite>;
    },
    ...options,
  });
}
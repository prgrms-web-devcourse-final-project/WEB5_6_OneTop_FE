
import { api } from "@/share/config/api";
import { PostWrite } from "../types";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export const useEditPost = (
  options: UseMutationOptions<unknown, Error, { data: PostWrite; id: string }>
) => {
  return useMutation({
    mutationFn: ({ data, id }: { data: PostWrite; id: string }) =>
      api.put(`/api/v1/posts/${id}`, data),
    ...options,
  });
};

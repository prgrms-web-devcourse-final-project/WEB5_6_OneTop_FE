import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { PostDetail, PostWrite } from "../types";
import { api } from "@/share/config/api";

export function useSetPost({
  options,
}: {
  options: UseMutationOptions<PostDetail, Error, PostWrite>;
}) {
  return useMutation({
    mutationFn: (post: PostWrite) =>
      api.post("/api/v1/posts", post).then((res) => res.data),
    ...options,
  });
}

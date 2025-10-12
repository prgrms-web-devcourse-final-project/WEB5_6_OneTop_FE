import { queryKeys } from "@/share/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/share/config/api";
import { PostDetail } from "../types";

export const useGetPost = (
  id: string,
  onSuccess?: (data: PostDetail) => void
) => {
  return useQuery<PostDetail>({
    queryKey: queryKeys.post.id(id),
    queryFn: async () => {
      const res = await api.get(`/api/v1/posts/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

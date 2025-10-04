import { api } from "@/share/config/api";
import { PostListResponse } from "../type";

export const getMyPosts = async (
  page: number,
  size: number = 10,
  sort: string = "createdDate,desc"
): Promise<PostListResponse> => {
  const { data } = await api.get("/api/v1/users/my-posts", {
    params: {
      page,
      size,
      sort,
    },
  });
  return data;
};

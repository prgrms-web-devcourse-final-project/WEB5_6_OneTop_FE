import { api } from "@/share/config/api";
import { CommentListResponse } from "../type";

export const getMyComments = async (
  page: number,
  size: number = 10,
  sort: string = "createdDate,desc"
): Promise<CommentListResponse> => {
  const { data } = await api.get("/api/v1/users/my-comments", {
    params: {
      page,
      size,
      sort,
    },
  });
  return data;
};

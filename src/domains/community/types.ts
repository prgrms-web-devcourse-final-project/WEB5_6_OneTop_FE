import z from "zod";
import { postsSchema } from "./schemas/posts";

export type postListResponse = {
  data: {
    items: Post[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
  message: string;
  status: number;
};

export type Post = z.infer<typeof postsSchema>;

export type PostFilterType = "ALL" | "CHAT" | "NOTICE" | "VOTE" | "SCENARIO";


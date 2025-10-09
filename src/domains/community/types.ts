import z from "zod";
import { postDetailSchema, postsSchema, postWriteSchema } from "./schemas/posts";
import { commentSchema, commentsResponseSchema } from "./schemas/comments";

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

export type PostDetail = z.infer<typeof postDetailSchema>;

export type PostFilterType = "ALL" | "CHAT" | "NOTICE" | "POLL" | "SCENARIO";

export type PostWrite = z.infer<typeof postWriteSchema>;

export type CommentsResponse = z.infer<typeof commentsResponseSchema>;

export type Comment = z.infer<typeof commentSchema>;

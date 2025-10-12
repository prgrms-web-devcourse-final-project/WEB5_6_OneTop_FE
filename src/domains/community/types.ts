import z from "zod";
import { postDetailSchema, postPollSchema, postsSchema, postWriteSchema } from "./schemas/posts";
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

export type PostFilterType = "ALL" | "CHAT" | "NOTICE" | "POLL" | "SCENARIO" | "MAIN";

export type SearchType = "TITLE" | "TITLE_CONTENT" | "AUTHOR";

export type PostSortType = "LATEST" | "LIKES";

export type PostPollType = z.infer<typeof postPollSchema>;

export type PostWrite = z.infer<typeof postWriteSchema>;

export type CommentsResponse = z.infer<typeof commentsResponseSchema>;

export type Comment = z.infer<typeof commentSchema>;

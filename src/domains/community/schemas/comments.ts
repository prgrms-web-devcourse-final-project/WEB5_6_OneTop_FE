import { z } from "zod";

export const commentSchema = z.object({
  commentId: z.number(),
  author: z.string(),
  content: z.string(),
  likeCount: z.number(),
  isMine: z.boolean(),
  isLiked: z.boolean(),
  createdDate: z.string(),
});

export const commentsResponseSchema = z.object({
  items: z.array(commentSchema),
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  last: z.boolean(),
});




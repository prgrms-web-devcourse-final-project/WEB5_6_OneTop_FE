

import { z } from "zod";

export const postCategorySchema = z.enum([
  "CHAT", 
  "NOTICE",
  "POLL",
  "SCENARIO"
]);

export const postsSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  author: z.string(),
  category: postCategorySchema,
  hide: z.boolean(),
  likeCount: z.number(),
  createdDate: z.string(),
});

// 검색 조건 스키마
export const searchConditionSchema = z.object({
  category: z.enum(["ALL", "CHAT", "NOTICE", "VOTE", "SCENARIO"]).optional(),
  searchType: z.enum(["TITLE", "TITLE_CONTENT", "AUTHOR"]).optional(),
  keyword: z.string().optional(),
});

// 페이지 정보 스키마
export const pageableSchema = z.object({
  page: z.number().min(0),
  size: z.number().min(1).max(100),
  sort: z.string().optional(),
});

// POST 요청 body 스키마
export const postSearchRequestSchema = z.object({
  condition: searchConditionSchema,
  pageable: pageableSchema,
});

export const postListResponseSchema = z.object({
  data: z.object({
    items: postsSchema.array(),
    page: z.number(),
    size: z.number(),
    totalPages: z.number(),
    totalElements: z.number(),
    last: z.boolean(),
  }),
  message: z.string(),
  status: z.number(),
});
import { z } from "zod";

// 게시판 카테고리
export const postCategorySchema = z.enum([
  "CHAT",
  "NOTICE",
  "POLL",
  "SCENARIO",
]);

// 게시판 리스트 스키마
export const postsSchema = z.object({
  postId: z.number(),
  title: z.string(),
  content: z.string().optional(),
  author: z.string(),
  boardType: postCategorySchema,
  hide: z.boolean().optional(),
  likeCount: z.number(),
  createdDate: z.string(),
  commentCount: z.number().optional(),
  liked: z.boolean().optional(),
});

// 게시판 상세 스키마
export const postDetailSchema = z.object({
  postId: z.number(),
  title: z.string(),
  content: z.string(),
  author: z.string(),
  category: postCategorySchema,
  likeCount: z.number(),
  liked: z.boolean(),
  createdDate: z.string(),
  polls: z
    .object({
      options: z.array(
        z.object({
          index: z.number(),
          text: z.string(),
        })
      ),
    })
    .optional(),
});

export const postWriteSchema = z.object({
  title: z.string(),
  content: z.string(),
  category: postCategorySchema,
  hide: z.boolean(),
  poll: z.object({
    options: z.array(
      z.object({
        index: z.number(),
        text: z.string(),
      })
    ),
  }).optional(),
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

// 게시판 리스트 응답 스키마
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

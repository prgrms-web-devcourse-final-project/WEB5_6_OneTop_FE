

import { z } from "zod";

export const postCategorySchema = z.enum([
  "CHAT", 
  "NOTICE",
  "VOTE",
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

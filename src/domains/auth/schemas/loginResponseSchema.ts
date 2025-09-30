import { z } from "zod";

export const userProfileSchema = z.object({
  id: z.number(),
  email: z.string(),
  username: z.string(),
  role: z.string(),
  nickname: z.string(),
  birthdayAt: z.string(),
  authProvider: z.string(),
});

export const loginResponseSchema = z.object({
  data: userProfileSchema,
  message: z.string(),
  status: z.number(),
});

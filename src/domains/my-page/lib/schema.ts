import { z } from "zod";

export const myInfoSchema = z.object({
  birthdayAt: z.string().min(1, "생년월일을 입력해주세요"),
  gender: z.enum(["M", "F"]),
  beliefs: z.string().min(1, "가치관을 입력해주세요"),
  mbti: z.object({
    ei: z.string().min(1, "선택해주세요"),
    sn: z.string().min(1, "선택해주세요"),
    tf: z.string().min(1, "선택해주세요"),
    jp: z.string().min(1, "선택해주세요"),
  }),
  lifeSatis: z.number().min(0).max(10).optional().nullable(),
  relationship: z.number().min(0).max(10).optional().nullable(),
  workLifeBal: z.number().min(0).max(10).optional().nullable(),
  riskAvoid: z.number().min(0).max(10).optional().nullable(),
});

export type MyInfoFormValues = z.infer<typeof myInfoSchema>;

import { z } from "zod";

export const myInfoSchema = z.object({
  birthdayAt: z.string().min(1, "생년월일을 입력해주세요"),
  gender: z.enum(["M", "F"]),
  beliefs: z.string().min(1, "가치관을 입력해주세요"),
  mbti: z.object({
    ei: z.enum(["E", "I"], "E 또는 I을 선택해주세요"),
    sn: z.enum(["S", "N"], "S 또는 N을 선택해주세요"),
    tf: z.enum(["T", "F"], "T 또는 F를 선택해주세요"),
    jp: z.enum(["J", "P"], "J 또는 P를 선택해주세요"),
  }),
  lifeSatis: z
    .number()
    .min(0, "0 이상 입력해주세요")
    .max(10, "10 이하 입력해주세요")
    .nullable()
    .optional(),
  relationship: z
    .number()
    .min(0, "0 이상 입력해주세요")
    .max(10, "10 이하 입력해주세요")
    .nullable()
    .optional(),
  workLifeBal: z
    .number()
    .min(0, "0 이상 입력해주세요")
    .max(10, "10 이하 입력해주세요")
    .nullable()
    .optional(),
  riskAvoid: z
    .number()
    .min(0, "0 이상 입력해주세요")
    .max(10, "10 이하 입력해주세요")
    .nullable()
    .optional(),
});

export type MyInfoFormValues = z.infer<typeof myInfoSchema>;

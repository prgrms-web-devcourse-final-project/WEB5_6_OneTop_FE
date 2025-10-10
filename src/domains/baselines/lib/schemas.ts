import { z } from "zod";

export const eventSchema = z.object({
  category: z.enum(["교육", "직업", "관계", "경제", "건강", "행복", "기타"]),
  eventTitle: z.string().min(1, "선택 상황을 입력해주세요"),
  actualChoice: z.string().min(1, "실제 선택을 입력해주세요"),
  context: z.string().optional(),
  ageAtEvent: z
    .string()
    .min(1, "나이를 입력해주세요")
    .refine((val) => /^\d+$/.test(val), {
      message: "나이를 숫자로 입력해주세요",
    })
    .transform((val) => Number(val))
    .refine((num) => num >= 1 && num <= 100, {
      message: "나이는 1세 이상 100세 이하이어야 합니다",
    }),
  yearOfEvent: z
    .number()
    .min(1900, "년도는 1900년 이상이어야 합니다")
    .max(2100, "년도는 2100년 이하여야 합니다"),
});

// 폼의 원시 입력 타입(전부 문자열 기반)
export type FormInput = z.input<typeof eventSchema>;
// 파싱 이후 타입(나이: number)
export type FormData = z.output<typeof eventSchema>;

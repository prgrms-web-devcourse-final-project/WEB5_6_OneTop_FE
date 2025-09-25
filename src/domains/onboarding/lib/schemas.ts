import { z } from "zod";

export const FormSchema = z.object({
  name: z.string().min(1, "이름은 필수 입력 항목입니다."),
  birthday: z.object({
    birthYear: z.number().min(1, "연도는 필수 입력 항목입니다."),
    birthMonth: z.number().min(1, "월은 필수 입력 항목입니다."),
    birthDay: z.number().min(1, "일은 필수 입력 항목입니다."),
  }),
  gender: z.string().min(1, "성별은 필수 입력 항목입니다."),
  mbti: z.string().min(1, "MBTI는 필수 입력 항목입니다."),
  preference: z.string().min(1, "성향은 필수 입력 항목입니다."),
  additional: z.object()
});
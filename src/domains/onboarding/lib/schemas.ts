import { z } from "zod";

export const FormSchema = z.object({
  name: z.string().min(1, "이름은 필수 입력 항목입니다."),
  birthday: z.string().min(1, "생년월일은 필수 입력 항목입니다."),
  gender: z.string().min(1, "성별은 필수 입력 항목입니다."),
  mbti: z.string().min(1, "MBTI는 필수 입력 항목입니다."),
  preference: z.string().min(1, "성향은 필수 입력 항목입니다."),
  addtional: z.object()
});

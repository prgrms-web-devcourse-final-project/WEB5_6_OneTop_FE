import { z } from "zod";

export const FormSchema = z.object({
  name: z.string().min(1, "이름은 필수 입력 항목입니다."),
  birthday_at: z.object({
    birthYear: z.number().min(1, "연도는 필수 입력 항목입니다."),
    birthMonth: z.number().min(1, "월은 필수 입력 항목입니다."),
    birthDay: z.number().min(1, "일은 필수 입력 항목입니다."),
  }),
  gender: z.string().min(1, "성별은 필수 입력 항목입니다."),
  mbti: z.string().min(1, "MBTI는 필수 입력 항목입니다."),
  beliefs: z.string("성향을 선택해주세요.").min(1, "성향을 선택해주세요."),
  additional: z.object(
    {
      life_satis:z.number("현재 삶 만족도를 입력해주세요.").min(1, "현재 삶 만족도를 입력해주세요."),
      relationships:z.number("관계 만족도를 입력해주세요.").min(1, "관계 만족도를 입력해주세요."),
      work_life_bal:z.number("자유 중시성을 입력해주세요.").min(1, "자유 중시성을 입력해주세요."),
      lisk_avoid:z.number("위험 회피 성향을 입력해주세요.").min(1, "위험 회피 성향을 입력해주세요."),
    }
  )
});
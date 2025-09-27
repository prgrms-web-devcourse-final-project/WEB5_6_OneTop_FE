import { z } from "zod";

export const FormSchema = z.object({
  name: z.string().min(1, "이름은 필수 입력 항목입니다."),
  birthday_at: z.object({
    birthYear: z
      .number("생년월일에서 연도는 필수 입력 항목입니다.")
      .min(1, "생년월일에서 연도는 필수 입력 항목입니다."),
    birthMonth: z
      .number("생년월일에서 월은 필수 입력 항목입니다.")
      .min(1, "생년월일에서 월은 필수 입력 항목입니다.")
      .max(12, "생년월일에서 월은 12월 이하여야 합니다."),
    birthDay: z
      .number("생년월일에서 일은 필수 입력 항목입니다.")
      .min(1, "생년월일에서 일은 필수 입력 항목입니다.")
      .max(31, "생년월일에서 일은 31일 이하여야 합니다."),
  }),
  gender: z.string().min(1, "성별은 필수 입력 항목입니다."),
  mbti: z.string().min(1, "MBTI는 필수 입력 항목입니다."),
  beliefs: z.string("성향을 선택해주세요.").min(1, "성향을 선택해주세요."),
  additional: z.object({
    life_satis: z
      .number("현재 삶 만족도를 입력해주세요.")
      .min(1, "현재 삶 만족도는 1보다 작을 수 없습니다."),
    relationships: z
      .number("관계 만족도를 입력해주세요.")
      .min(1, "관계 만족도는 1보다 작을 수 없습니다."),
    work_life_bal: z
      .number("자유 중시성을 입력해주세요.")
      .min(1, "자유 중시성은 1보다 작을 수 없습니다."),
    lisk_avoid: z
      .number("위험 회피 성향을 입력해주세요.")
      .min(1, "위험 회피 성향은 1보다 작을 수 없습니다."),
  }),
});

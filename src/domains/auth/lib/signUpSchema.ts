import z from "zod";

export const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const signUpSchema = z
  .object({
    email: z
      .email("이메일 형식이 올바르지 않습니다.")
      .min(1, "이메일은 필수 입력 항목입니다."),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .max(16, "비밀번호는 16자 이하이어야 합니다.")
      .refine(
        (password) => passwordRegex.test(password),
        "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다."
      ),
    passwordConfirm: z.string().min(1, "비밀번호 확인은 필수 입력 항목입니다."),
    name: z
      .string()
      .min(1, "이름은 필수 입력 항목입니다.")
      .max(20, "이름은 20자 이하이어야 합니다."),
    nickname: z
      .string()
      .min(1, "닉네임은 필수 입력 항목입니다.")
      .max(12, "닉네임은 12자 이하이어야 합니다."),
    birthday_at: z.object({
      year: z.coerce
        .number({ message: "연도는 숫자여야 합니다." })
        .int({ message: "연도는 정수여야 합니다." })
        .min(0, "기원전 입력은 불가능합니다."),
      month: z.coerce
        .number({ message: "월은 숫자여야 합니다." })
        .int({ message: "월은 정수여야 합니다." })
        .min(1, "월은 필수 입력 항목입니다.")
        .max(12, "월은 12월까지 가능합니다."),
      day: z.coerce
        .number({ message: "일은 숫자여야 합니다." })
        .int({ message: "일은 정수여야 합니다." })
        .min(1, "일은 필수 입력 항목입니다.")
        .max(31, "일은 31일까지 가능합니다."),
    }),
    agree: z.coerce
      .boolean()
      .refine((agree) => agree, "개인정보처리방침에 동의해야 합니다."),
  })
  // supaRefine으로 외부 연계되는 값 유효성 검사
  .superRefine(({ password, passwordConfirm, birthday_at }, ctx) => {
    if (password !== passwordConfirm) {
      ctx.addIssue({
        code: "custom",
        path: ["passwordConfirm"],
        message: "비밀번호가 일치하지 않습니다.",
      });
    }

    const birthDate = new Date(birthday_at.year, birthday_at.month - 1, birthday_at.day);
    const { year, month } = birthday_at;
    const maxDay = new Date(year, month, 0).getDate();

    if (birthday_at.day > maxDay) {
      ctx.addIssue({
        code: "custom",
        path: ["birthday_at", "day"],
        message: `${year}년 ${month}월은 ${maxDay}일까지 가능합니다.`,
      });
    }

    if (birthDate > new Date()) {
      ctx.addIssue({
        code: "custom",
        path: ["birthday_at", "day"],
        message: "생년월일은 오늘 이전이어야 합니다.",
      });
    }
  })
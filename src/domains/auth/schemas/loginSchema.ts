import z from "zod";

export const passwordRegex =
/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const loginSchema = z.object({
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
});
"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const schema = z
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
    name: z.string().min(1, "이름은 필수 입력 항목입니다."),
    birth: z.object({
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
  .superRefine(({ password, passwordConfirm, birth }, ctx) => {
    if (password !== passwordConfirm) {
      ctx.addIssue({
        code: "custom",
        path: ["passwordConfirm"],
        message: "비밀번호가 일치하지 않습니다.",
      });
    }

    const birthDate = new Date(birth.year, birth.month - 1, birth.day);
    const { year, month } = birth;
    const maxDay = new Date(year, month, 0).getDate();

    if (birth.day > maxDay) {
      ctx.addIssue({
        code: "custom",
        path: ["birth", "day"],
        message: `${year}년 ${month}월은 ${maxDay}일까지 가능합니다.`,
      });
    }

    if (birthDate > new Date()) {
      ctx.addIssue({
        code: "custom",
        path: ["birth", "day"],
        message: "생년월일은 오늘 이전이어야 합니다.",
      });
    }
  })
  // transform으로 외부 연계되는 값 변환
  .transform((data) => {
    return {
      ...data,
      birth: `${data.birth.year}-${data.birth.month}-${data.birth.day}`,
    };
  });

function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    trigger,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      agree: false,
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log(data);
  };

  // 생년/월/일 한 필드라도 변경되면 즉시 유효성 검사
  const birth = useWatch({ control, name: "birth" });
  useEffect(() => {
    // 값이 입력되었을 때만 유효성 검사 실행
    if (birth?.year || birth?.month || birth?.day) {
      void trigger(["birth.year", "birth.month", "birth.day"]);
    }
  }, [birth?.year, birth?.month, birth?.day, trigger]);

  return (
    <div className="flex flex-col gap-10">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
        {/* 이메일 입력 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 justify-between">
            <label htmlFor="email">이메일</label>
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>
          <div className="flex gap-3">
            <input
              className="w-full border border-gray-200 rounded-sm px-4 py-3 flex-4"
              {...register("email")}
            />
            <button
              type="button"
              className="bg-deep-navy text-white rounded-md p-4 font-semibold flex-1 px-4 py-3"
            >
              중복 확인
            </button>
          </div>
          <label className="text-gray-500" htmlFor="email">
            Re:Life에서는 이메일을 아이디로 사용합니다.
          </label>
        </div>

        {/* 비밀번호 입력 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 justify-between">
            <label htmlFor="password">비밀번호</label>
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </div>
          <input
            type="password"
            className="w-full border border-gray-200 rounded-sm px-4 py-3"
            {...register("password")}
          />
          <label className="text-gray-500" htmlFor="password">
            비밀번호는 8글자 이상, 16글자 이하 특수문자, 영문, 숫자를 포함해야
            합니다.
          </label>
        </div>

        {/* 비밀번호 재확인 입력 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 justify-between">
            <label htmlFor="passwordConfirm">비밀번호 확인</label>
            {errors.passwordConfirm && (
              <span className="text-red-500">
                {errors.passwordConfirm.message}
              </span>
            )}
          </div>
          <input
            type="password"
            className="w-full border border-gray-200 rounded-sm px-4 py-3"
            {...register("passwordConfirm")}
          />
          <label className="text-gray-500" htmlFor="passwordConfirm">
            위에서 입력한 비밀번호와 같은 비밀번호를 입력해주세요.
          </label>
        </div>

        {/* 이름 입력 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 justify-between">
            <label htmlFor="name">이름</label>
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>
          <input
            className="w-full border border-gray-200 rounded-sm px-4 py-3"
            {...register("name")}
          />

          <label className="text-gray-500" htmlFor="name">
            사용자의 성함을 입력해주세요.
          </label>
        </div>

        {/* 생년월일 입력 */}
        {/* 여기 파트만 validation 타이밍이 다른데, 일단 패스. */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 justify-between">
            <label htmlFor="birth">생년월일</label>
            {errors.birth?.day && (
              <span className="text-red-500">
                {/* 연월일 순으로 오류 메시지 표시 */}
                {errors.birth?.year?.message ||
                  errors.birth?.month?.message ||
                  errors.birth?.day?.message}
              </span>
            )}
          </div>
          <div className="flex gap-3 items-center w-full">
            <input
              placeholder="2025"
              className="border border-gray-200 rounded-sm px-4 py-3 w-20 text-center"
              {...register("birth.year")}
            />
            <span className="text-gray-600">년</span>
            <input
              placeholder="09"
              className="border border-gray-200 rounded-sm px-4 py-3 w-16 text-center"
              {...register("birth.month")}
            />
            <span className="text-gray-600">월</span>
            <input
              placeholder="22"
              className="border border-gray-200 rounded-sm px-4 py-3 w-16 text-center"
              {...register("birth.day")}
            />
            <span className="text-gray-600">일</span>
          </div>
          <label className="text-gray-500" htmlFor="birth">
            사용자의 생년월일을 입력해주세요.
          </label>
        </div>

        {/* 개인정보처리방침 입력 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 justify-between">
            <label htmlFor="agree">개인정보처리방침</label>
            {errors.agree && (
              <span className="text-red-500">{errors.agree.message}</span>
            )}
          </div>
          <div className="text-gray-500 border border-gray-200 rounded-sm p-4">
            개인정보처리방침 [필수] <br />
            개인정보 수집·이용 동의 수집 항목: 이름, <br />
            생년월일 수집 목적: 서비스 식별 및 맞춤 선택지 제공, 부적절한 컨텐츠
            필터링 <br />
            보유·이용 기간: 서비스 종료 시 또는 회원 탈퇴 시 즉시 파기 <br />
            제3자 제공: 없음 <br />
            처리 위탁: AWS(서버 호스팅) <br />
            ※ 동의를 거부하실 수 있으나, 동의하지 않을 경우 서비스 이용이
            제한됩니다. ※<br />
          </div>

          <div className="flex items-center gap-3 justify-end">
            <input type="radio" value="true" {...register("agree")} />
            <label htmlFor="agree">동의합니다.</label>
            <input
              type="radio"
              className="w-4 h-4"
              value=""
              {...register("agree")}
            />
            <label htmlFor="agree">동의하지 않습니다.</label>
          </div>
        </div>

        {/* 가입하기 버튼 */}
        <button
          type="submit"
          className="bg-deep-navy text-white rounded-sm px-4 py-3 font-semibold block w-full"
          disabled={isSubmitting}
        >
          가입하기
        </button>
      </form>
    </div>
  );
}
export default SignUpForm;

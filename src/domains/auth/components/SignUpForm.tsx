"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { signUpSchema as schema } from "../schemas/signUpSchema";
import { useRouter } from "next/navigation";
import { signupAction } from "@/app/api/actions/signup";
import { SignUpRequest } from "@/domains/types";

function SignUpForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

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

  // 생년/월/일 한 필드라도 변경되면 즉시 유효성 검사
  const birthday_at = useWatch({ control, name: "birthday_at" });
  useEffect(() => {
    // 값이 입력되었을 때만 유효성 검사 실행
    if (birthday_at?.year || birthday_at?.month || birthday_at?.day) {
      void trigger([
        "birthday_at.year",
        "birthday_at.month",
        "birthday_at.day",
      ]);
    }
  }, [birthday_at?.year, birthday_at?.month, birthday_at?.day, trigger]);

  // 회원가입 요청
  const onSubmit = async (data: SignUpRequest) => {
    setIsPending(true);
    const formData = new FormData();

    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("name", data.name);
    formData.append("nickname", data.nickname);
    if (data.birthday_at) {
      formData.append("birthday_at.year", data.birthday_at.year.toString());
      formData.append("birthday_at.month", data.birthday_at.month.toString());
      formData.append("birthday_at.day", data.birthday_at.day.toString());
    }
    formData.append("agree", data.agree.toString());

    const result = await signupAction(formData);

    if (result.success) {
      console.log("회원가입 성공", result.data);
      router.push("/");
    } else {
      setError(result.data.message);
    }
    
    setIsPending(false);
  };

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

          <input
            className="w-full border border-gray-200 rounded-sm px-4 py-3 flex-4"
            {...register("email")}
          />

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

        {/* 이름 입력 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 justify-between">
            <label htmlFor="nickname">닉네임</label>
            {errors.nickname && (
              <span className="text-red-500">{errors.nickname.message}</span>
            )}
          </div>
          <input
            className="w-full border border-gray-200 rounded-sm px-4 py-3"
            {...register("nickname")}
          />

          <label className="text-gray-500" htmlFor="nickname">
            다른 사용자에게 보일 닉네임을 입력해주세요.
          </label>
        </div>

        {/* 생년월일 입력 */}
        {/* 여기 파트만 validation 타이밍이 다른데, 일단 패스. */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 justify-between">
            <label htmlFor="birth">생년월일</label>
            {(errors.birthday_at?.year ||
              errors.birthday_at?.month ||
              errors.birthday_at?.day) && (
              <span className="text-red-500">
                {/* 연월일 순으로 오류 메시지 표시 */}
                {errors.birthday_at?.year?.message ||
                  errors.birthday_at?.month?.message ||
                  errors.birthday_at?.day?.message}
              </span>
            )}
          </div>
          <div className="flex gap-3 items-center w-full">
            <input
              placeholder="2025"
              className="border border-gray-200 rounded-sm px-4 py-3 w-20 text-center"
              {...register("birthday_at.year")}
            />
            <span className="text-gray-600">년</span>
            <input
              placeholder="09"
              className="border border-gray-200 rounded-sm px-4 py-3 w-16 text-center"
              {...register("birthday_at.month")}
            />
            <span className="text-gray-600">월</span>
            <input
              placeholder="22"
              className="border border-gray-200 rounded-sm px-4 py-3 w-16 text-center"
              {...register("birthday_at.day")}
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

        {error && <p className="text-red-500">{error}</p>}

        {/* 가입하기 버튼 */}
        <button
          type="submit"
          className="bg-deep-navy text-white rounded-sm px-4 py-3 font-semibold block w-full"
          disabled={isSubmitting || isPending}
        >
          {isPending ? "가입중..." : "가입하기"}
        </button>
      </form>
    </div>
  );
}
export default SignUpForm;

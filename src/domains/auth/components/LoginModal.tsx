"use client";

import { useForm } from "react-hook-form";
import { useLoginModalStore } from "@/domains/auth/stores/loginModalStore";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { loginAction } from "@/app/api/actions/login";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/share/config/queryKeys";
import { loginSchema } from "../schemas/loginSchema";
import { useRouter } from "next/navigation";

// TODO : 알림 영역이 나올 영역을 지정하고 덜컥거리지 않게 변경. 폼 검증과 서버 에러를 한개씩만 표시. ( 로그인은 좀 불친절해도 괜찮음. )
function LoginModal() {
  const isOpen = useLoginModalStore((s) => s.isOpen);
  const setIsOpen = useLoginModalStore((s) => s.setIsOpen);
  const qc = useQueryClient();
  const [error, setError] = useState("");
  const router = useRouter();
  const schema = loginSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    resolver: zodResolver(schema),
  });

  // 회원가입 요청
  const onSubmit = async (data: z.infer<typeof schema>) => {
    const formData = new FormData();

    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      await loginAction(formData);
      // 로그인 성공
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get("redirectTo");

      closeModal();

      qc.invalidateQueries({ queryKey: queryKeys.auth.all() });

      router.refresh();
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push("/");
      }
    } catch (error) {
      // Error 객체에서 메시지 추출 (loginAction에서 이미 처리됨)
      const errorMessage =
        error instanceof Error
          ? error.message
          : "로그인 중 오류가 발생했습니다.";
      setError(errorMessage);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setError("");
    reset();
  };

  return (
    isOpen && (
      // 백그라운드
      <div
        className="fixed inset-0 bg-black/50 flex justify-center items-center z-1000"
        onClick={closeModal}
      >
        {/* 모달 */}
        <div
          className="flex flex-col bg-white rounded-lg p-8 w-120 gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between w-full">
            <h1 className="text-3xl font-semibold font-family-logo text-deep-navy">
              Re:Life
            </h1>
            <button
              type="button"
              onClick={closeModal}
              className="text-gray-800 hover:text-black"
            >
              닫기
            </button>
          </div>

          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="email"
              placeholder="이메일"
              className="w-full h-14 rounded-md border border-gray-300 px-4"
              {...register("email")}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p className="text-gray-500 text-sm">{errors.email.message}</p>
            )}

            <input
              type="password"
              placeholder="비밀번호"
              className="w-full h-14 rounded-md border border-gray-300 px-4"
              {...register("password")}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && (
              <p className="text-gray-500 text-sm">{errors.password.message}</p>
            )}

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="flex-1 h-14 bg-deep-navy text-white rounded-md transition-colors"
                disabled={isSubmitting}
              >
                이메일로 로그인
              </button>

              <Link
                href="/sign-up"
                className="flex items-center justify-center flex-1 h-14 bg-white text-deep-navy rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                회원가입
              </Link>
            </div>
          </form>

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex gap-4 items-center">
            <hr className="w-full" />
            <div className="text-gray-800 text-nowrap">또는</div>
            <hr className="w-full" />
          </div>

          <button
            type="button"
            className="w-full h-15 bg-black text-white rounded-md flex items-center px-6 gap-2"
          >
            <FaGithub className="w-6 h-6" />
            Github로 로그인
          </button>
          <button
            type="button"
            className="w-full h-15 rounded-md border border-gray-300 flex items-center px-6 gap-2"
          >
            <FaGoogle className="w-6 h-6" style={{ color: "#4285F4" }} />
            Google로 로그인
          </button>
        </div>
      </div>
    )
  );
}
export default LoginModal;

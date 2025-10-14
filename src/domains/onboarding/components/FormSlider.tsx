"use client";

import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { steps } from "../lib/steps";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import tw from "@/share/utils/tw";
import { useSliderAnimation } from "../hooks/useSliderAnimation";
import { FieldErrors, useForm } from "react-hook-form";
import { FormSchema } from "../lib/schemas";
import { isValidFormKey, StepDefinition, UserOnboardingData } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Swal from "sweetalert2";
import { useSetUserProfile } from "../api/useSetUserProfile";

function FormSlider({ initialStep }: { initialStep: number }) {
  // URL 정보 처리 HOOK
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // URL 정보를 안전한 값으로 처리
  const stepFromUrl = Number(sp.get("step") ?? initialStep);
  const safeIdx = Math.min(Math.max(stepFromUrl, 0), steps.length - 1);
  // ZUSTAND 데이터 불러오기

  // 애니메이션 훅으로 관심사 분리
  const { rootRef, trackRef, addItemRef } = useSliderAnimation(safeIdx);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<UserOnboardingData>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });

  // useMutation으로 API 호출 관리
  const {mutate, isPending} = useSetUserProfile()

  // 해당 슬라이드로 이동 이벤트 핸들러
  const goto = (to: number) => {
    const clamp = Math.max(0, Math.min(to, steps.length - 1));
    const next = new URLSearchParams(sp.toString());
    next.set("step", clamp.toString());
    router.replace(`${pathname}?${next.toString()}`);
  };

  const onPrev = () => {
    goto(safeIdx - 1);
  };

  const onNext = () => {
    // TODO: 유효성 검사 로직 추가 (이미지 파일 체크, 필수 입력 체크)
    goto(safeIdx + 1);
  };

  const onSubmit = (data: UserOnboardingData) => {
    mutate(data);
  };

  const onError = (errors: FieldErrors<UserOnboardingData>) => {
    // 모든 에러 메시지를 재귀적으로 수집하는 함수
    const collectErrorMessages = (
      errorObj: Record<string, unknown>,
      prefix = ""
    ): string[] => {
      const messages: string[] = [];

      Object.entries(errorObj).forEach(([key, error]) => {
        if (error && typeof error === "object") {
          if ("message" in error && error.message) {
            // 직접적인 에러 메시지
            messages.push(`${error.message}`);
          } else {
            // 중첩된 객체 (예: birthday_at)
            const nestedMessages = collectErrorMessages(
              error as Record<string, unknown>,
              prefix ? `${prefix}.${key}` : key
            );
            messages.push(...nestedMessages);
          }
        }
      });

      return messages;
    };

    const errorMessages = collectErrorMessages(errors);

    // SweetAlert2로 에러 메시지 표시
    Swal.fire({
      icon: "error",
      title: "입력 오류",
      html: `
        <div style="text-align: center; margin: 10px 0;">
          ${errorMessages
            .map((error) => `<p style="margin: 8px 0;">${error}</p>`)
            .join("")}
        </div>
      `,
      confirmButtonText: "확인",
    });
  };

  const onGoHome = () => {
    Swal.fire({
      icon: "warning",
      title: "진행하던 사항을 삭제하고 \n 메인 페이지로 이동하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/");
      }
    });
  };

  return (
    <>
      <div
        ref={rootRef}
        className="relative w-screen h-screen invisible flex flex-col items-center justify-center"
      >
        <button
          className="absolute top-4 left-4 z-20 flex items-center gap-2"
          onClick={onGoHome}
        >
          <Image
            src="/logo_64.svg"
            alt="logo"
            width={32}
            height={32}
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <h1 className="text-xl font-bold font-family-logo text-white">
            Re:Life
          </h1>
        </button>
        {/* 페이지 넘기기 버튼 */}
        <button
          type="button"
          className="cursor-pointer absolute left-10 -translate-y-1/2 z-20"
          onClick={onPrev}
          disabled={safeIdx === 0}
        >
          <AiOutlineLeft
            size={80}
            className={tw("text-white", safeIdx === 0 && "opacity-50")}
          />
        </button>

        <button
          type="button"
          className="cursor-pointer absolute right-10 -translate-y-1/2 z-20"
          onClick={() => {
            onNext();
          }}
          disabled={safeIdx === steps.length - 1}
        >
          <AiOutlineRight
            size={80}
            className={tw(
              "text-white",
              safeIdx === steps.length - 1 && "opacity-50"
            )}
          />
        </button>

        {/* 폼 슬라이드 */}
        <div className="relative w-[80%] h-full overflow-hidden z-10">
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            ref={trackRef}
            className="absolute top-0 left-0 h-full will-change-transform"
            style={{ width: `${steps.length * 100}%` }}
          >
            {/* 전체 폼 구성 */}
            {steps.map((s: StepDefinition, index: number) => {
              const StepComponent = s.component;
              return (
                <div
                  key={s.key}
                  ref={addItemRef}
                  className="absolute top-0 left-0 h-full flex items-center justify-center flex-col gap-10"
                  style={{ width: `${100 / steps.length}%` }}
                >
                  {/* 질문 라벨 */}
                  <label
                    htmlFor={s.key}
                    className="text-white text-5xl font-semibold"
                  >
                    {s.label}
                  </label>

                  {/* 이곳을 커스텀 input 요소들로 교체해야 함. */}
                  {isValidFormKey(s.key) && (
                    <StepComponent
                      id={s.key}
                      placeholder={s.placeholder}
                      register={register}
                      errors={errors[s.key]}
                      setValue={setValue}
                      control={control}
                      className={"h-80"}
                    />
                  )}

                  {/* 완료 버튼 */}
                  {index > steps.length - 3 ? (
                    // 마지막 단계: 완료 버튼들
                    <>
                      <div className="flex items-center justify-center gap-8">
                        <button
                          type="submit"
                          className="h-14 rounded-md w-40 p-2 bg-white flex items-center justify-center text-center text-2xl outline-none"
                          disabled={!!errors[s.key] || isPending}
                        >
                          {isPending ? "처리중..." : "완료하기"}
                        </button>
                        {index === steps.length - 2 && (
                          <button
                            type="button"
                            className="h-14 rounded-md w-40 bg-blue-500 text-white flex items-center justify-center text-xl p-2"
                            onClick={() => {
                              onNext();
                            }}
                          >
                            추가 정보 입력
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    // 일반 단계: 다음 버튼
                    <div className="flex items-center justify-center gap-8">
                      <button
                        type="button"
                        className={tw(
                          "h-14 rounded-md w-40 p-2 bg-white flex items-center justify-center",
                          "text-center text-2xl outline-none",
                          errors[s.key] &&
                            "bg-midnight-blue shadow-[inset_0_4px_4px_0_rgba(0,0,0,0.25)] text-white"
                        )}
                        disabled={!!errors[s.key]}
                        onClick={onNext}
                      >
                        {!!errors[s.key] ? "미완료" : "다음"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </form>
        </div>

        {/* 프로그레스 */}
        <ul className="w-full list-none flex items-center justify-center gap-4 absolute bottom-10 z-20">
          {steps.map((_, i) => (
            <li
              key={i}
              onClick={() => goto(i)}
              className={`w-7 h-7 rounded-full border-2 border-white cursor-pointer ${
                i === safeIdx ? "bg-white" : ""
              }`}
              title={`step ${i + 1}`}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
export default FormSlider;

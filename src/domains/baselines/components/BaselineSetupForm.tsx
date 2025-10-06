"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Swal from "sweetalert2";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBaselineStore } from "../stores/baselineStore";
import { LifeEvent } from "../types";

const eventSchema = z.object({
  category: z.enum(["교육", "직업", "관계", "경제", "건강", "행복", "기타"]),
  eventTitle: z.string().min(1, "선택 상황을 입력해주세요"),
  actualChoice: z.string().min(1, "실제 선택을 입력해주세요"),
  context: z.string().optional(),
  ageAtEvent: z
    .string()
    .min(1, "나이를 입력해주세요")
    .refine((val) => /^\d+$/.test(val), {
      message: "나이를 숫자로 입력해주세요",
    })
    .transform((val) => Number(val))
    .refine((num) => num >= 1 && num <= 100, {
      message: "나이는 1세 이상 100세 이하이어야 합니다",
    }),
  yearOfEvent: z
    .number()
    .min(1900, "년도는 1900년 이상이어야 합니다")
    .max(2100, "년도는 2100년 이하여야 합니다"),
});
// 폼의 원시 입력 타입(전부 문자열 기반)
type FormInput = z.input<typeof eventSchema>;
// 파싱 이후 타입(나이: number)
type FormData = z.output<typeof eventSchema>;

interface Props {
  isOpen: boolean;
  selectedYear: number | null;
  existingEvent?: LifeEvent | null;
  onClose: () => void;
  className?: string;
  birthYear?: number;
}

export const BaselineSetupForm = ({
  isOpen,
  selectedYear,
  existingEvent,
  onClose,
  birthYear,
}: Props) => {
  const {
    addEventLocal,
    updateEventLocal,
    deleteEventLocal,
    events,
    isSubmitted,
  } = useBaselineStore();

  // 자동 높이 조절 함수
  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = Math.min(element.scrollHeight, 120) + "px";
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm<FormInput, unknown, FormData>({
    resolver: zodResolver(eventSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (isOpen && selectedYear) {
      if (existingEvent) {
        reset({
          category: existingEvent.category,
          eventTitle: existingEvent.eventTitle,
          actualChoice: existingEvent.actualChoice,
          context: existingEvent.context || "",
          ageAtEvent: String(existingEvent.age),
          yearOfEvent: existingEvent.year,
        });
      } else {
        reset({
          category: "교육" as const,
          eventTitle: "",
          actualChoice: "",
          context: "",
          ageAtEvent: "",
          yearOfEvent: selectedYear,
        });
      }
    }
  }, [isOpen, selectedYear, existingEvent, reset]);

  // 나이 입력 시 자동으로 년도 계산
  const watchAge = watch("ageAtEvent");
  useEffect(() => {
    if (watchAge && /^\d+$/.test(watchAge) && birthYear) {
      const ageNum = Number(watchAge);
      if (ageNum >= 1 && ageNum <= 100) {
        const calculatedYear = birthYear + (ageNum - 1);
        setValue("yearOfEvent", calculatedYear, { shouldValidate: true });
      }
    }
  }, [watchAge, setValue, birthYear]);

  const onSubmit = async (data: FormData) => {
    try {
      const calculatedYear = birthYear
        ? birthYear + (data.ageAtEvent - 1)
        : 2000 + (data.ageAtEvent - 1);

      const eventData = {
        year: calculatedYear,
        age: data.ageAtEvent,
        category: data.category,
        eventTitle: data.eventTitle.trim(),
        actualChoice: data.actualChoice.trim(),
        context: data.context?.trim(),
      };

      if (existingEvent) {
        updateEventLocal(existingEvent.id, eventData);

        Swal.fire({
          title: "수정 완료",
          html: "분기점이 수정되었습니다. <br/>'마무리하고 제출' 버튼을 클릭하여 최종 저장하세요.",
          icon: "success",
          confirmButtonColor: "#6366f1",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        addEventLocal(eventData);

        Swal.fire({
          title: "저장 완료",
          html: "분기점이 임시 저장되었습니다. <br/>'마무리하고 제출' 버튼을 클릭하여 최종 저장하세요.",
          icon: "success",
          confirmButtonColor: "#6366f1",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      onClose();
    } catch (error) {
      console.error("저장 실패:", error);
      Swal.fire({
        title: "저장 실패",
        text: "저장 중 오류가 발생했습니다.",
        icon: "error",
        confirmButtonColor: "#E76F51",
        confirmButtonText: "확인",
      });
    }
  };

  const handleDelete = async () => {
    if (!existingEvent) return;

    // 제출된 상태에서는 삭제 불가
    if (isSubmitted) {
      Swal.fire({
        title: "삭제 불가",
        text: "이미 제출된 베이스라인은 수정할 수 없습니다.",
        icon: "warning",
        confirmButtonColor: "#6366f1",
        confirmButtonText: "확인",
      });
      return;
    }

    const result = await Swal.fire({
      title: "분기점 삭제",
      text: "정말로 이 분기점을 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E76F51",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
      try {
        deleteEventLocal(existingEvent.id);
        onClose();

        Swal.fire({
          title: "삭제 완료",
          text: "분기점이 삭제되었습니다.",
          icon: "success",
          confirmButtonColor: "#E76F51",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("삭제 실패:", error);
        Swal.fire({
          title: "삭제 실패",
          text: "삭제 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonColor: "#E76F51",
          confirmButtonText: "확인",
        });
      }
    }
  };

  if (!isOpen || !selectedYear) return null;

  return (
    <div className="flex-1 bg-[linear-gradient(246deg,_rgba(217,217,217,0)_41.66%,_rgba(130,79,147,0.15)_98.25%)]">
      <div className="fixed top-[60px] w-[54.5vw] ml-[155px] mt-30">
        {/* 폼 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="flex items-center justify-center w-[150px] h-11 bg-gray-300 rounded-4xl">
              분기점 {existingEvent ? "수정" : "입력"}
            </span>
          </div>

          {existingEvent && !isSubmitted && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-[#E76F51] text-white px-4 py-2 rounded"
            >
              분기점 삭제
            </button>
          )}
        </div>

        {/* 제출 상태 알림 */}
        {isSubmitted && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
            <p className="text-blue-800 text-sm">
              이미 제출된 베이스라인입니다. 수정하려면 새로운 베이스라인을
              작성해주세요.
            </p>
          </div>
        )}

        {/* 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* 카테고리 선택 */}
          <div className="relative flex items-center border border-white rounded-lg py-3 pl-7 pr-5">
            <label className="block w-[115px] text-white text-lg mr-5 before:absolute before:content-[''] before:inline-block before:w-[2px] before:h-[calc(100%-32px)] before:bg-white before:left-[140px] before:top-4 before:rounded-full">
              카테고리
            </label>
            <div className="flex flex-wrap gap-4">
              {(["교육", "직업", "관계", "경제", "기타"] as const).map(
                (category) => (
                  <label key={category} className="flex items-center">
                    <input
                      {...register("category")}
                      type="radio"
                      value={category}
                      className="sr-only"
                      disabled={isSubmitted}
                    />
                    <div
                      className={`flex items-center justify-center w-[90px] h-[40px] rounded-lg border text-white text-base cursor-pointer transition-colors ${
                        isSubmitted ? "opacity-50 cursor-not-allowed" : ""
                      } ${
                        watch("category") === category
                          ? "bg-dusty-blue border-dusty-blue"
                          : "border-white hover:bg-dusty-blue hover:border-dusty-blue"
                      }`}
                    >
                      {category}
                    </div>
                  </label>
                )
              )}
              {errors.category && (
                <p className="text-[#E76F51] text-sm w-full mt-2">
                  카테고리를 선택해주세요
                </p>
              )}
            </div>
          </div>

          {/* 선택 시기 */}
          <div className="relative flex items-center min-h-[70px] border border-white rounded-lg py-3 pl-7 pr-5">
            <span className="block w-[115px] text-lg text-white mr-5 before:absolute before:content-[''] before:inline-block before:w-[2px] before:h-[calc(100%-32px)] before:bg-white before:left-[140px] before:top-4 before:rounded-full">
              선택 시기
            </span>
            <div className="flex flex-col text-white">
              <div className="flex items-center">
                <input
                  {...register("ageAtEvent")}
                  type="text"
                  className="min-h-11 w-[90px] px-3 text-gray-800 bg-white rounded-lg disabled:opacity-50"
                  placeholder="나이 입력"
                  inputMode="numeric"
                  disabled={isSubmitted}
                />
                <span className="inline-block ml-2 mr-4">세</span>
                {/* 계산된 년도 표시 */}
                <span className="text-gray-300 text-sm">
                  {watchAge &&
                  /^\d+$/.test(watchAge) &&
                  Number(watchAge) > 0 &&
                  birthYear
                    ? `(${birthYear + (Number(watchAge) - 1)}년)`
                    : "(나이 입력 시 년도 자동 계산)"}
                </span>
              </div>
              {errors.ageAtEvent && (
                <p className="mt-1 text-[#E76F51] text-sm">
                  {errors.ageAtEvent.message}
                </p>
              )}
            </div>
          </div>

          {/* 선택 상황 + 실제 선택 */}
          <div className="relative border border-white rounded-lg py-3 pl-7 pr-5">
            {/* 선택 상황 */}
            <div className="flex items-start text-white mb-3">
              <label className="block w-[115px] text-lg pt-2 mr-5 before:absolute before:content-[''] before:inline-block before:w-[2px] before:h-[calc(100%-32px)] before:bg-white before:left-[140px] before:top-4 before:rounded-full">
                선택 상황
              </label>
              <div className="flex-1">
                <textarea
                  rows={1}
                  placeholder="선택하게 된 상황을 입력해주세요 (ex. 이과를 갈까? 문과를 갈까?)"
                  {...register("eventTitle", {
                    onBlur: (e) => adjustTextareaHeight(e.target),
                  })}
                  className="w-full bg-white rounded-lg text-gray-800 p-3 resize-none overflow-hidden min-h-12 max-h-[120px] disabled:opacity-50"
                  onInput={(e) => adjustTextareaHeight(e.currentTarget)}
                  disabled={isSubmitted}
                />
                {errors.eventTitle && (
                  <p className="text-[#E76F51] text-sm mt-1">
                    {errors.eventTitle.message}
                  </p>
                )}
              </div>
            </div>

            {/* 실제 선택 */}
            <div className="flex items-center text-white">
              <label className="block w-[115px] text-lg mr-5 before:absolute before:content-[''] before:inline-block before:w-[2px] before:h-[calc(100%-32px)] before:bg-white before:left-[140px] before:top-4 before:rounded-full">
                실제 선택
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="실제로 어떤 선택을 했는지 입력해주세요 (ex. 이과를 선택했습니다)"
                  {...register("actualChoice")}
                  className="w-full bg-white h-12 rounded-lg text-gray-800 p-3 disabled:opacity-50"
                  disabled={isSubmitted}
                />
                {errors.actualChoice && (
                  <p className="text-[#E76F51] text-sm mt-1">
                    {errors.actualChoice.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 추가 설명 */}
          <div className="relative flex items-start border border-white rounded-lg py-3 pl-7 pr-5">
            <label className="block w-[115px] pt-2 mr-5 text-white before:absolute before:content-[''] before:inline-block before:w-[2px] before:h-[calc(100%-32px)] before:bg-white before:left-[140px] before:top-4 before:rounded-full">
              추가 설명 <br />
              (선택사항)
            </label>
            <textarea
              rows={1}
              placeholder="선택에 추가적인 배경이나 판단 기준이 있었다면 적어주세요"
              {...register("context")}
              className="flex-1 bg-white rounded-lg text-gray-800 p-3 resize-none overflow-hidden min-h-12 max-h-[120px] disabled:opacity-50"
              onInput={(e) => adjustTextareaHeight(e.currentTarget)}
              disabled={isSubmitted}
            />
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-3 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="w-[130px] h-12 text-white text-lg bg-dusty-blue rounded-lg hover:bg-opacity-80 transition-colors"
            >
              취소
            </button>
            {!isSubmitted && (
              <button
                type="submit"
                className={`w-[130px] h-12 text-lg rounded-lg transition-colors ${
                  isValid
                    ? "bg-white text-gray-800 hover:bg-gray-100"
                    : "bg-gray-500 text-gray-300"
                }`}
              >
                {existingEvent ? "수정" : "저장"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

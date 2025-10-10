"use client";

import { UseMutationResult } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/share/components/Modal";
import { MyInfoFormValues, myInfoSchema } from "../../lib/schema";
import { MyInfo } from "../../type";
import tw from "@/share/utils/tw";
import {
  FaCalendar,
  FaUser,
  FaRegLightbulb,
  FaChartBar,
  FaRegThumbsUp,
  FaRegHeart,
  FaWind,
  FaShieldAlt,
} from "react-icons/fa";

interface MyInfoModalProps {
  data: MyInfo;
  mutation: UseMutationResult<MyInfo, Error, Partial<MyInfo>>;
  onClose: () => void;
}

export default function MyInfoModal(props: MyInfoModalProps) {
  const { data, mutation, onClose } = props;
  const mbtiArray = data.mbti.split("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MyInfoFormValues>({
    resolver: zodResolver(myInfoSchema),
    defaultValues: {
      birthdayAt: data.birthdayAt.split("T")[0],
      gender: data.gender,
      beliefs: data.beliefs,
      mbti: {
        ei: mbtiArray[0] as "E" | "I",
        sn: mbtiArray[1] as "S" | "N",
        tf: mbtiArray[2] as "T" | "F",
        jp: mbtiArray[3] as "J" | "P",
      },
      lifeSatis: data.lifeSatis ?? undefined,
      relationship: data.relationship ?? undefined,
      workLifeBal: data.workLifeBal ?? undefined,
      riskAvoid: data.riskAvoid ?? undefined,
    },
  });

  const onSubmit = (formData: MyInfoFormValues) => {
    const mbtiString = `${formData.mbti.ei}${formData.mbti.sn}${formData.mbti.tf}${formData.mbti.jp}`;
    mutation.mutate(
      {
        username: data.username,
        email: data.email,
        birthdayAt: new Date(formData.birthdayAt).toISOString(),
        gender: formData.gender,
        beliefs: formData.beliefs,
        mbti: mbtiString,
        lifeSatis: formData.lifeSatis,
        relationship: formData.relationship,
        workLifeBal: formData.workLifeBal,
        riskAvoid: formData.riskAvoid,
      },
      { onSuccess: onClose }
    );
  };

  const baseInputClass = tw(
    "w-full px-3 py-2 border border-gray-300 rounded-lg",
    "focus:outline-none focus:border-deep-navy",
    "transition text-sm hover:border-gray-400"
  );

  const selectClass = tw(
    "w-full px-3 py-2 border border-gray-300 rounded-lg",
    "focus:outline-none focus:border-deep-navy",
    "transition appearance-none bg-white text-sm cursor-pointer hover:border-gray-400"
  );

  const mbtiSelectClass = tw(
    "w-full px-2 py-2 border border-gray-300 rounded-lg",
    "focus:outline-none focus:border-deep-navy",
    "transition text-center font-semibold appearance-none bg-white text-sm cursor-pointer hover:border-gray-400"
  );

  const labelClass = tw(
    "flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5"
  );
  const errorClass = tw("text-red-500 text-xs mt-1");

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="내 정보 수정"
      actions={[
        { label: "취소", onClick: onClose, variant: "outline" },
        {
          label: mutation.isPending ? "저장중..." : "저장",
          onClick: handleSubmit(onSubmit),
          variant: "primary",
          disabled: mutation.isPending,
        },
      ]}
    >
      <form className={tw("flex flex-col gap-6")}>
        <div>
          <h4 className={tw("text-base font-semibold mb-3")}>기본 정보</h4>
          <div className={tw("grid grid-cols-2 gap-4")}>
            <div>
              <label className={labelClass}>
                <FaCalendar size={12} /> 생년월일
              </label>
              <input
                type="date"
                {...register("birthdayAt")}
                className={baseInputClass}
              />
              {errors.birthdayAt && (
                <p className={errorClass}>{errors.birthdayAt.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>
                <FaUser size={12} /> 성별
              </label>
              <select {...register("gender")} className={selectClass}>
                <option value="M">남성</option>
                <option value="F">여성</option>
              </select>
              {errors.gender && (
                <p className={errorClass}>{errors.gender.message}</p>
              )}
            </div>
            <div className={tw("col-span-2")}>
              <label className={labelClass}>
                <FaRegLightbulb size={12} /> 가치관
              </label>
              <input {...register("beliefs")} className={baseInputClass} />
              {errors.beliefs && (
                <p className={errorClass}>{errors.beliefs.message}</p>
              )}
            </div>
            <div className={tw("col-span-2")}>
              <label className={labelClass}>
                <FaChartBar size={12} /> MBTI
              </label>
              <div className={tw("grid grid-cols-4 gap-2")}>
                {(["ei", "sn", "tf", "jp"] as const).map((key) => (
                  <select
                    key={key}
                    {...register(`mbti.${key}`)}
                    className={mbtiSelectClass}
                  >
                    {(key === "ei"
                      ? ["E", "I"]
                      : key === "sn"
                      ? ["S", "N"]
                      : key === "tf"
                      ? ["T", "F"]
                      : ["J", "P"]
                    ).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
              {(errors.mbti?.ei ||
                errors.mbti?.sn ||
                errors.mbti?.tf ||
                errors.mbti?.jp) && (
                <p className={errorClass}>MBTI를 모두 선택해주세요</p>
              )}
            </div>
          </div>
        </div>
        <div>
          <h4 className={tw("text-base font-semibold mb-3")}>추가 정보</h4>
          <div className={tw("grid grid-cols-2 gap-4")}>
            {(
              [
                "삶의 만족도",
                "관계 만족도",
                "자유 중요도",
                "위험 회피",
              ] as const
            ).map((label, idx) => {
              const key = [
                "lifeSatis",
                "relationship",
                "workLifeBal",
                "riskAvoid",
              ][idx] as keyof MyInfoFormValues;
              const Icon =
                key === "lifeSatis"
                  ? FaRegThumbsUp
                  : key === "relationship"
                  ? FaRegHeart
                  : key === "workLifeBal"
                  ? FaWind
                  : FaShieldAlt;
              return (
                <div key={key}>
                  <label className={labelClass}>
                    <Icon size={12} /> {label}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    {...register(key, {
                      setValueAs: (v: string | null) =>
                        v === "" || v === null || v === undefined
                          ? null
                          : Number(v),
                    })}
                    className={baseInputClass}
                  />
                  {errors[key] && (
                    <p className={errorClass}>{errors[key]?.message}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </Modal>
  );
}

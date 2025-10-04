"use client";

import { UseMutationResult } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/share/components/Modal";
import { MyInfoFormValues, myInfoSchema } from "../../lib/schema";
import { MyInfo } from "../../type";

interface MyInfoModalProps {
  data: MyInfo;
  mutation: UseMutationResult<MyInfo, Error, Partial<MyInfo>>;
  onClose: () => void;
}

export default function MyInfoModal({
  data,
  mutation,
  onClose,
}: MyInfoModalProps) {
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
      {
        onSuccess: onClose,
      }
    );
  };

  return (
    <Modal
      isOpen={true}
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
      <form className="flex flex-col gap-6">
        <div>
          <h4 className="font-semibold mb-3">기본 정보</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">생년월일</label>
              <input
                type="date"
                {...register("birthdayAt")}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.birthdayAt && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.birthdayAt.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">성별</label>
              <select
                {...register("gender")}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="M">남성</option>
                <option value="F">여성</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">가치관</label>
              <input
                {...register("beliefs")}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.beliefs && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.beliefs.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">MBTI</h4>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <select
                {...register("mbti.ei")}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="E">E</option>
                <option value="I">I</option>
              </select>
              {errors.mbti?.ei && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mbti.ei.message}
                </p>
              )}
            </div>
            <div>
              <select
                {...register("mbti.sn")}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="S">S</option>
                <option value="N">N</option>
              </select>
              {errors.mbti?.sn && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mbti.sn.message}
                </p>
              )}
            </div>
            <div>
              <select
                {...register("mbti.tf")}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="T">T</option>
                <option value="F">F</option>
              </select>
              {errors.mbti?.tf && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mbti.tf.message}
                </p>
              )}
            </div>
            <div>
              <select
                {...register("mbti.jp")}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="J">J</option>
                <option value="P">P</option>
              </select>
              {errors.mbti?.jp && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mbti.jp.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">추가 정보 (선택사항)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                삶의 만족도 (0-10)
              </label>
              <input
                type="number"
                min={0}
                max={10}
                {...register("lifeSatis", {
                  setValueAs: (v) => {
                    if (v === "" || v === null || v === undefined)
                      return undefined;
                    const num = Number(v);
                    return isNaN(num) ? undefined : num;
                  },
                })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="선택사항"
              />
              {errors.lifeSatis && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lifeSatis.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                관계 만족도 (0-10)
              </label>
              <input
                type="number"
                min={0}
                max={10}
                {...register("relationship", {
                  setValueAs: (v) => {
                    if (v === "" || v === null || v === undefined)
                      return undefined;
                    const num = Number(v);
                    return isNaN(num) ? undefined : num;
                  },
                })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="선택사항"
              />
              {errors.relationship && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.relationship.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                자유 중요도 (0-10)
              </label>
              <input
                type="number"
                min={0}
                max={10}
                {...register("workLifeBal", {
                  setValueAs: (v) => {
                    if (v === "" || v === null || v === undefined)
                      return undefined;
                    const num = Number(v);
                    return isNaN(num) ? undefined : num;
                  },
                })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="선택사항"
              />
              {errors.workLifeBal && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.workLifeBal.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                위험 회피 (0-10)
              </label>
              <input
                type="number"
                min={0}
                max={10}
                {...register("riskAvoid", {
                  setValueAs: (v) => {
                    if (v === "" || v === null || v === undefined)
                      return undefined;
                    const num = Number(v);
                    return isNaN(num) ? undefined : num;
                  },
                })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="선택사항"
              />
              {errors.riskAvoid && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.riskAvoid.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}

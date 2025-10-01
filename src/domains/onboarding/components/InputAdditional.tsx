"use client";


import { Controller } from "react-hook-form";
import { CustomProgressListType, InputProps } from "../types";
import CustomProgress from "./CustomProgress";
import tw from "@/share/utils/tw";

const CustomProgressList: CustomProgressListType[] = [
  {
    key: "life_satis",
    title: "현재 삶 만족도",
    description: [
      "-현재 삶에 대한 만족도를 1~10으로 평가해 입력해주세요.",
      "-본인에 대한 데이터가 아닐 경우 최종 선택에서의 예상되는 만족도를 입력해주세요.",
    ],
  },
  {
    key: "relationships",
    title: "현재 삶 관계 만족도",
    description: [
      "-가족, 연애, 친구 등과 같은 관계에서의 만족도를 1~10으로 평가해 입력해주세요.",
      "-본인에 대한 데이터가 아닐 경우 최종 선택지에서의 예상되는 만족도를 입력해주세요.",
    ],
  },
  {
    key: "work_life_bal",
    title: "자유 중시성",
    description: [
      "-성공과 자유로운 삶에서 중요하게 여기는 정도를 1~10으로 입력해주세요.",
      "-자유로운 삶이 더 중요할 경우 값을 더 높게 설정해주세요.",
    ],
  },
  {
    key: "risk_avoid",
    title: "위험 회피 성향",
    description: [
      "-선택에서 리스크를 감내하는 정도를 1~10으로 입력해주세요.",
      "-위험 회피 성향은 '생존 본능'의 의미가 아닌 선택에 대해 얼마나 위험부담을 지지 않고 상대적으로 '안전한 선택'을 선택하는지를 의미합니다.",
    ],
  },
];

function InputAdditional({ control, className }: InputProps) {
  return (
    <>
      <div className="text-center text-lg text-gray-500">
        제공해주신 추가 정보는 Re:Life의 Ai 분석의 정확도를 높이기 위해
        사용되며, 다른 용도로 이용되지 않습니다.
      </div>
      <div className={tw("w-full grid grid-cols-2 gap-x-4 gap-y-4", className)}>
        <Controller
          control={control}
          name={"additional"}
          defaultValue={{
            life_satis: 5,
            relationships: 5,
            work_life_bal: 5,
            risk_avoid: 5,
          }}
          render={({ field }) => (
            <>
              {CustomProgressList.map((item, index) => (
                <CustomProgress
                  key={"progress" + index}
                  progress={field.value[item.key]}
                  title={item.title}
                  hint={item.description}
                  className="p-6 jusify-center"
                  onChange={(value) =>
                    field.onChange({ ...field.value, [item.key]: value })
                  }
                />
              ))}
            </>
          )}
        />
      </div>
    </>
  );
}

export default InputAdditional;

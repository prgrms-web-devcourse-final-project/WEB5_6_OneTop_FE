"use client";

import tw from "@/share/utils/tw";
import { InputProps } from "../types";
import { Controller } from "react-hook-form";

const mbtiObject = {
  E: "I",
  S: "N",
  T: "F",
  J: "P",
  I: "E",
  N: "S",
  F: "T",
  P: "J",
};

// TODO : FLIP 애니메이션 추가
function InputMbti({ control, className }: InputProps) {
  type mbtiTypes = keyof typeof mbtiObject;

  const flipMbtiString = (mbti: string, target: mbtiTypes) => {
    return mbti
      .split("")
      .map((item) => (item === target ? mbtiObject[target as mbtiTypes] : item))
      .join("");
  };

  return (
    <Controller
      control={control}
      name={"mbti"}
      defaultValue="ESTJ"
      render={({ field }) => (
        <div className={tw("flex gap-20 items-center justify-center w-full py-5", className)}>
          {field.value.split("").map((item, index) => (
            <button
              className="w-20 text-center py-12 rounded-lg text-4xl font-medium transition-all duration-200 
              text-white border-1 border-white hover:bg-gray-900 overflow-hidden"
              key={item}
              onClick={() =>
                field.onChange(flipMbtiString(field.value, item as mbtiTypes))
              }
            >
              {item}
            </button>
          ))}
        </div>
      )}
    />
  );
}

export default InputMbti;

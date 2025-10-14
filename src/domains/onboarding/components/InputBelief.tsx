"use client";

import tw from "@/share/utils/tw";
import { InputProps } from "../types";
import { Controller } from "react-hook-form";

const NORMAL_BELIEFS = [
  "성장",
  "자유",
  "안정",
  "창의성",
  "책임",
  "공정",
  "인간 관계",
  "도전",
  "기여",
  "즐거움",
];

function InputBelief({ control, className }: InputProps) {
  return (
    <Controller
      control={control}
      name={"beliefs"}
      render={({ field }) => (
        <>
          <div
            className={tw(
              "flex flex-col items-center justify-center",
              className
            )}
          >
            <div className="grid grid-cols-5 gap-x-8 gap-y-10">
              {NORMAL_BELIEFS.map((belief) => (
                <button
                  key={belief}
                  type="button"
                  onClick={() => field.onChange(belief)}
                  className={tw(
                    "text-center p-4 rounded-lg text-3xl font-medium transition-all duration-200",
                    "text-white border-1 border-white hover:bg-gray-500 overflow-hidden",
                    field.value === belief &&
                      "bg-white text-black hover:bg-white"
                  )}
                >
                  {belief}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    />
  );
}

export default InputBelief;

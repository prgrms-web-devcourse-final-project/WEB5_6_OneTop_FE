import { Controller, useWatch } from "react-hook-form";
import { InputProps } from "../types";
import tw from "@/share/utils/tw";
import { AiOutlineMan, AiOutlineWoman } from "react-icons/ai";

function InputGender({ id, control, className }: InputProps) {
  return (
    <Controller
      control={control}
      name={id}
      defaultValue="male"
      render={({ field }) => (
        <div className={tw("flex gap-20 items-center justify-center w-full py-5", className)}>
          <button
            type="button"
            onClick={() => field.onChange("male")}
            className={tw(
              "px-8 py-4 rounded-lg text-2xl font-medium transition-all duration-200 hover:opacity-80",
              field.value === "male"
                ? "drop-shadow-md shadow-white opacity-100 scale-115 hover:opacity-100"
                : "drop-shadow-md shadow-white opacity-50"
            )}
          >
            <AiOutlineMan className="text-blue-500" size={160} />
            <div className="text-2xl font-medium text-white">남성</div>
          </button>
          <button
            type="button"
            onClick={() => field.onChange("female")}
            className={tw(
              "px-8 py-4 rounded-lg text-2xl font-medium transition-all duration-200 hover:opacity-80",
              field.value === "female"
                ? "drop-shadow-md shadow-white opacity-100 scale-115 hover:opacity-100"
                : "drop-shadow-md shadow-white opacity-50"
            )}
          >
            <AiOutlineWoman className="text-red-500" size={160} />
            <div className="text-2xl font-medium text-white">여성</div>
          </button>
        </div>
      )}
    />
  );
}
export default InputGender;

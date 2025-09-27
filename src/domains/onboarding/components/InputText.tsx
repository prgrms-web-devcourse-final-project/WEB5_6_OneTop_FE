"use client";

import tw from "@/share/utils/tw";
import { useOnboardingStore } from "../stores/useOnboardingStore";
import { InputProps, isValidFormKey } from "../types";

function InputText({
  id,
  placeholder,
  register,
  errors,
  className,
}: InputProps) {
  if (!isValidFormKey(id)) {
    return <>해당 키 값에 해당하는 입력란이 없습니다.</>;
  }

  // 타입 에러에 지쳐서 "name" 하드코딩했는데 추후 id로 변경할 것...
  return (
    <div className={tw("flex items-center justify-center", className)}>
      <input
        id={id}
        type="text"
        {...register(id)}
        className={tw(
          "h-18 rounded-md border-2 border-white w-80 p-6 bg-white",
          "text-center text-2xl outline-none"
        )}
        placeholder={placeholder}
      />
    </div>
  );
}

export default InputText;

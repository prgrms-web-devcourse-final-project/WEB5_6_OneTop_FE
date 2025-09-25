"use client";

import { useOnboardingStore } from "../stores/useOnboardingStore";
import { InputProps, isValidFormKey } from "../types";

function InputText({ id, placeholder, register, errors }: InputProps) {
  if (!isValidFormKey(id)) {
    return <>해당 키 값에 해당하는 입력란이 없습니다.</>;
  }

  // 타입 에러에 지쳐서 "name" 하드코딩했는데 추후 id로 변경할 것...
  return (
    <>
      <input
        id={id}
        type="text"
        {...register(id)}
        className="h-18 rounded-md border-2 border-white w-80 p-6 bg-white
                 placeholder:text-gray-500 text-center text-2xl outline-none"
        placeholder={placeholder}
      />
      {errors && <p>{errors[id]?.message?.toString()}</p>}
    </>
  );
}

export default InputText;

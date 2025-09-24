"use client";


import { useOnboardingStore } from "../stores/useOnboardingStore";
import { DateInputProps, isValidFormKey } from "../types";



function InputText({ id, placeholder, register, errors }: DateInputProps) {
  const data = useOnboardingStore((s) => s.data);
  const setData = useOnboardingStore((s) => s.setData);

  if (!isValidFormKey(id)) {
    return <>해당 키 값에 해당하는 입력란이 없습니다.</>;
  }

  return (
    <>
      <input
        id={id}
        type="text"
        {...register(id)}
        className="h-18 rounded-md border-2 border-white w-80 p-6 bg-white
                 placeholder:text-gray-500 text-center text-2xl outline-none"
        placeholder={placeholder}
        value={data[id as keyof typeof data] ?? ""}
        onChange={(e) => setData({ ...data, [id]: e.target.value })}
      />
      {errors && <p>{errors.message}</p>}
    </>
  );
}

export default InputText;

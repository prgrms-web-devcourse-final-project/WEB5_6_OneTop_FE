"use client";

import { useOnboardingStore } from "../stores/useOnboardingStore";

interface InputTextProps {
  id: string;
  placeholder: string;
}

function InputText({ id, placeholder }: InputTextProps) {
  const data = useOnboardingStore((s) => s.data);
  const setData = useOnboardingStore((s) => s.setData);

  return (
    <input
      id={id}
      type="text"
      className="h-18 rounded-md border-2 border-white w-80 p-6 bg-white
                 placeholder:text-gray-500 text-center text-2xl outline-none"
      placeholder={placeholder}
      value={data[id as keyof typeof data] ?? ""}
      onChange={(e) => setData({ ...data, [id]: e.target.value })}
    />
  );
}

export default InputText;
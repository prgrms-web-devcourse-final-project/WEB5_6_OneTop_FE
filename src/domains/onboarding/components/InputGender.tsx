import { InputProps } from "../types";

function InputGender({
  id,
  placeholder,
  register,
  errors,
  setValue,
}: InputProps) {
  return (
    <div>
      <input
        type="radio"
        id={id}
        value="male"
        {...register(id)}
        placeholder={placeholder}
        className="h-18 rounded-md border-2 border-white w-80 p-6 bg-white
                 placeholder:text-gray-500 text-center text-2xl outline-none"
      />
      <input
        type="radio"
        id={id}
        value="female"
        {...register(id)}
        placeholder={placeholder}
        className="h-18 rounded-md border-2 border-white w-80 p-6 bg-white
                 placeholder:text-gray-500 text-center text-2xl outline-none"
      />
    </div>
  );
}
export default InputGender;

import { InputProps } from "../types";
import { Controller } from "react-hook-form";

function InputBelief({ control }: InputProps) {
  return (
    <Controller
      control={control}
      name={"beliefs"}
      render={({ field }) => (
        <div>InputBelief</div>
      )}
    />
  )
}

export default InputBelief
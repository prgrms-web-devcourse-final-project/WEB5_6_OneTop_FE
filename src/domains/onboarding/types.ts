import { steps } from "./lib/steps";
import { FormSchema } from "./lib/schemas";
import { z } from "zod";
import { FieldError, UseFormRegister } from "react-hook-form";

export const isValidFormKey = (key: StepKeys): key is keyof UserOnboardingData => {
  return steps.some((s) => s.key === key);
};

export type StepKeys =
  | "name"
  | "birthday"
  | "gender"
  | "mbti"
  | "preference"
  | "addtional"
  | "done";

export type StepDefinition = {
  key: StepKeys;
  label: string;
  placeholder: string;
  component: React.ComponentType<{
    id: StepKeys;
    placeholder: string;
    register: UseFormRegister<UserOnboardingData>;
    errors?: FieldError;
  }>;
};

export const stepIndex = (step: StepKeys) =>
  steps.findIndex((s) => s.key === step);

export const stepByIndex = (index: number) => steps[index];

// 스키마에서 타입 추출
export type UserOnboardingData = z.infer<typeof FormSchema>;

// 하위 input 컴포넌트 Props 타입
export interface DateInputProps {
  id: StepKeys;
  placeholder: string;
  register: UseFormRegister<UserOnboardingData>;
  errors?: FieldError;
}

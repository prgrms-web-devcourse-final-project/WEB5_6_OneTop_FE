import { steps } from "./lib/steps";
import { FormSchema } from "./lib/schemas";
import { z } from "zod";
import { FieldErrors, UseFormRegister, UseFormSetValue, Control } from "react-hook-form";

export const isValidFormKey = (
  key: StepKeys
): key is keyof UserOnboardingData => {
  return steps.some((s) => s.key === key);
};

// 키 종류
export type StepKeys =
  | "name"
  | "birthday_at"
  | "gender"
  | "mbti"
  | "beliefs"
  | "additional"

// lib에 정의된 steps 타입
export type StepDefinition = {
  key: StepKeys;
  label: string;
  placeholder: string;
  component: React.ComponentType<InputProps>;
};

// 하위 input 컴포넌트 Props 타입
// TODO : UseFormReturn 타입으로 변경하면 좀 더 확장성 있을 것 같음.
export type InputProps = {
  id: StepKeys;
  placeholder: string;
  register: UseFormRegister<UserOnboardingData>;
  className?: string;
  errors?: FieldErrors<UserOnboardingData>;
  setValue?: UseFormSetValue<UserOnboardingData>;
  control?: Control<UserOnboardingData>;
};


export const stepIndex = (step: StepKeys) =>
  steps.findIndex((s) => s.key === step);

export const stepByIndex = (index: number) => steps[index];

// 스키마에서 타입 추출
export type UserOnboardingData = z.infer<typeof FormSchema>;


export type CustomProgressListType = {
  key: "life_satis" | "relationships" | "work_life_bal" | "risk_avoid";
  title: string;
  description: string[];
};

export type AdditionalValues = {
  life_satis: number;
  relationships: number;
  work_life_bal: number;
  risk_avoid: number;
};
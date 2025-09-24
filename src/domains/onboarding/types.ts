import { steps } from "./lib/steps";
import { FormSchema } from "./lib/schemas";
import { z } from "zod";

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
  component: React.ComponentType<{ id: string; placeholder: string }>;
};

export const stepIndex = (step: StepKeys) =>
  steps.findIndex((s) => s.key === step);

export const stepByIndex = (index: number) => steps[index];

// 스키마에서 타입 추출
export type UserOnboardingData = z.infer<typeof FormSchema>;

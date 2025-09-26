import { create } from "zustand";
import { UserOnboardingData } from "../types";
import { persist } from "zustand/middleware";

interface OnboardingStore {
  data: UserOnboardingData;
  setData: (data: UserOnboardingData) => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      data: {} as UserOnboardingData,
      setData: (data: UserOnboardingData) => set({ data }),
    }),
    {
      name: "relife-onboarding-data",
    }
  )
);

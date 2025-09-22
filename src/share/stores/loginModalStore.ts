import { create } from "zustand";

export type LoginModalStore = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const useLoginModalStore = create<LoginModalStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));

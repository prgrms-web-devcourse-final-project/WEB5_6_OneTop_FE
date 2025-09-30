import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "USER" | "GUEST" | "ADMIN";
export type Gender = "F" | "M";

interface User {
  id: number;
  email?: string;
  username?: string;
  role: UserRole;
  birthdayAt: string;
  gender?: Gender;
  mbti?: string;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;

  setUser: (user: User) => void;
  clearUser: () => void;

  getBirthYear: () => number | null;
  calculateYear: (age: number) => number | null;
  calculateAge: (year: number) => number | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isGuest: false,

      setUser: (user) => {
        console.log("사용자 설정:", user);
        set({
          user,
          isAuthenticated: true,
          isGuest: user.role === "GUEST",
        });
      },

      clearUser: () => {
        console.log("사용자 로그아웃");
        set({
          user: null,
          isAuthenticated: false,
          isGuest: false,
        });
      },

      getBirthYear: () => {
        const { user } = get();
        if (!user?.birthdayAt) {
          console.warn("생년월일 정보 없음");
          return null;
        }
        const birthYear = new Date(user.birthdayAt).getFullYear();
        console.log("출생 연도:", birthYear);
        return birthYear;
      },

      calculateYear: (age: number) => {
        const birthYear = get().getBirthYear();
        if (!birthYear) return null;
        return birthYear + age;
      },

      calculateAge: (year: number) => {
        const birthYear = get().getBirthYear();
        if (!birthYear) return null;
        return year - birthYear;
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

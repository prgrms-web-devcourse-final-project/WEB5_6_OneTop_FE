"use client";

import { queryKeys } from "@/share/config/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/api/actions/logout";

export const useLogout = () => {
  const qc = useQueryClient();
  const router = useRouter();

  const logout = async () => {
    try {
      await logoutAction();
      await qc.invalidateQueries({ queryKey: ["auth"]});

      router.refresh();

      router.push("/");

      return { success: true };
    } catch (error) {
      throw new Error("Failed to logout", { cause: error });
    }
  };

  return { logout };
};

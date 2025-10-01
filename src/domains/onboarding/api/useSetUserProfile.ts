"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { setUserProfile } from "../api/setUserProfile";
import { queryKeys } from "@/share/config/queryKeys";

export function useSetUserProfile() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: queryKeys.profile.set(),
    mutationFn: setUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all() });
      router.push("/baselines");
    },
    onError: (error) => {
      console.error("프로필 설정 실패:", error);
      Swal.fire({
        icon: "error",
        title: "프로필 설정 실패",
        text: "프로필 설정 중 오류가 발생했습니다. 다시 시도해주세요.",
        confirmButtonText: "확인",
      });
    },
  });
}

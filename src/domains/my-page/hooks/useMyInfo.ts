import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/share/config/queryKeys";
import { getMyInfo, putMyInfo } from "../api/myInfoApi";
import Swal from "sweetalert2";

export function useMyInfo() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.myInfo.get(),
    queryFn: getMyInfo,
  });

  const mutation = useMutation({
    mutationFn: putMyInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myInfo.get() });
      queryClient.invalidateQueries({ queryKey: queryKeys.usageStats.all() });

      Swal.fire({
        title: "저장 완료",
        text: "정보가 저장되었습니다.",
        icon: "success",
        confirmButtonColor: "#0f1a2b",
        confirmButtonText: "확인",
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "저장 실패",
        text: error instanceof Error ? error.message : "저장에 실패했습니다.",
        icon: "error",
        confirmButtonColor: "#0f1a2b",
        confirmButtonText: "확인",
      });
    },
  });

  return { query, mutation };
}

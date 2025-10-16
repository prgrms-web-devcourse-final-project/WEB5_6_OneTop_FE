import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/share/config/queryKeys";
import { getMyInfo, putMyInfo } from "../api/myInfoApi";
import Swal from "sweetalert2";
import { showErrorToast } from "@/share/components/ErrorToast";

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
    onError: () => {
      showErrorToast("변경을 완료하지 못했습니다. 다시 시도해주세요.");
    },
  });

  return { query, mutation };
}

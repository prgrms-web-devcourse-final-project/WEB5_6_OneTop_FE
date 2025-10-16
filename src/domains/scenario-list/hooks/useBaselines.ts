import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { queryKeys } from "@/share/config/queryKeys";
import { getBaselines, deleteBaseline } from "../api/BaselineApi";
import Swal from "sweetalert2";

export function useBaselines(page: number, size: number = 10) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.baselines.list(page, size),
    queryFn: () => getBaselines(page, size),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBaseline,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.baselines.list(page, size),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.scenarios.list(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.myScenarios.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.usageStats.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.representativeProfile.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tree.all(),
      });

      Swal.fire({
        title: "삭제 완료",
        text: "베이스라인이 삭제되었습니다.",
        icon: "success",
        confirmButtonColor: "#0f1a2b",
        confirmButtonText: "확인",
      });
    },
  });

  return { query, deleteMutation };
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/share/config/queryKeys";
import {
  getRepresentativeProfile,
  putRepresentativeProfile,
} from "../api/representativeProfileApi";
import Swal from "sweetalert2";
import { showErrorToast } from "@/share/components/ErrorToast";

export function useRepresentativeProfile() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.representativeProfile.get(),
    queryFn: getRepresentativeProfile,
  });

  const mutation = useMutation({
    mutationFn: putRepresentativeProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.representativeProfile.get(),
      });

      Swal.fire({
        title: "저장 완료",
        text: "대표 프로필이 저장되었습니다.",
        icon: "success",
        confirmButtonColor: "#0f1a2b",
        confirmButtonText: "확인",
      });
    },
    onError: () => {
      showErrorToast("프로필 설정에 실패했습니다. 다시 시도해주세요.");
    },
  });

  return { query, mutation };
}

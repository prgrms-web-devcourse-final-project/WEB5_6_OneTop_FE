import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/share/config/queryKeys";
import {
  getRepresentativeProfile,
  putRepresentativeProfile,
} from "../api/representativeProfileApi";
import Swal from "sweetalert2";

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

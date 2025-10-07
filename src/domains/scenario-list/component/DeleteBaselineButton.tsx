"use client";

import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/share/config/queryKeys";
import { deleteBaseline } from "../api/BaselineApi";

interface DeleteBaselineButtonProps {
  baselineId: number;
  currentPage: number;
  pageSize: number;
}

export default function DeleteBaselineButton({
  baselineId,
  currentPage,
  pageSize,
}: DeleteBaselineButtonProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteBaseline,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.baselines.list(currentPage, pageSize),
      });

      Swal.fire({
        title: "삭제 완료",
        text: "베이스라인이 삭제되었습니다.",
        icon: "success",
        confirmButtonColor: "#0f1a2b",
        confirmButtonText: "확인",
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "삭제 실패",
        text: error instanceof Error ? error.message : "삭제에 실패했습니다.",
        icon: "error",
        confirmButtonColor: "#0f1a2b",
        confirmButtonText: "확인",
      });
    },
  });

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "선택한 베이스라인을 삭제하시겠습니까?",
      text: "베이스라인과 관련된 전체 시나리오가 삭제됩니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f1a2b",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(baselineId);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleteMutation.isPending}
      className="flex h-9 px-5 py-3 justify-center items-center gap-2.5 flex-shrink-0 rounded-md border border-deep-navy bg-transparent text-deep-navy hover:bg-deep-navy hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {deleteMutation.isPending ? "삭제 중..." : "삭제"}
    </button>
  );
}

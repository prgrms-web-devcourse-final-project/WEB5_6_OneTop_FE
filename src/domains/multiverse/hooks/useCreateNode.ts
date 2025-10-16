import { useMutation } from "@tanstack/react-query";
import { createDecisionNode } from "../api/tree";
import { showErrorToast } from "@/share/components/ErrorToast";

export const useCreateNode = () => {
  return useMutation({
    mutationFn: createDecisionNode,

    onError: () => {
      showErrorToast("데이터를 불러오지 못했습니다. 다시 시도해주세요.");
    },
  });
};

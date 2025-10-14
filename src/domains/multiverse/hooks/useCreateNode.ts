import { useMutation } from "@tanstack/react-query";
import { createDecisionNode } from "../api/tree";

export const useCreateNode = () => {
  return useMutation({
    mutationFn: createDecisionNode,

    onError: (error) => {
      console.error("노드 생성 실패:", error);
    },
  });
};

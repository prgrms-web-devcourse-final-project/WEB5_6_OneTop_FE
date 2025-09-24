import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { baselineApi } from "../api/baselineService";

export const baselineKeys = {
  all: ["timeline"] as const,
  trees: () => [...baselineKeys.all, "trees"] as const,
  tree: (id: string) => [...baselineKeys.trees(), id] as const,
};

export const useCreateBaseNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: baselineApi.createBaseNode,
    onSuccess: () => {
      // 관련된 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: baselineKeys.trees() });
    },
    onError: (error) => {
      console.error("베이스 노드 생성 실패:", error);
    },
  });
};

export const useTreeData = (id: string) => {
  return useQuery({
    queryKey: baselineKeys.tree(id),
    queryFn: () => baselineApi.getTree(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5분
    retry: (failureCount, error: unknown) => {
      // 404는 재시도하지 않음
      //if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
};

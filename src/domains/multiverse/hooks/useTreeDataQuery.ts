import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/share/config/queryKeys";
import { getTreeData } from "../api/tree";
import { TreeData } from "../types";

export function useTreeDataQuery(baselineId: number) {
  return useQuery<TreeData>({
    queryKey: queryKeys.tree.detail(baselineId),
    queryFn: () => getTreeData(baselineId),
  });
}

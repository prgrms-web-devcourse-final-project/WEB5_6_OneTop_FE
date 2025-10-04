import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { queryKeys } from "@/share/config/queryKeys";
import { getMyScenarios } from "../api/myScenarios";

export function useMyScenarios(
  page: number,
  pageSize?: number,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: queryKeys.myScenarios.list(page),
    queryFn: () => getMyScenarios(page, pageSize),
    placeholderData: keepPreviousData,
    enabled,
  });
}

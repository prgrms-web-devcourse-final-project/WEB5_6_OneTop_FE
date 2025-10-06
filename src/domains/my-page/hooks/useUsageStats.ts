import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/share/config/queryKeys";
import { getUsageStats } from "../api/usageStatsApi";

export function useUsageStats() {
  return useQuery({
    queryKey: queryKeys.usageStats.all(),
    queryFn: getUsageStats,
  });
}

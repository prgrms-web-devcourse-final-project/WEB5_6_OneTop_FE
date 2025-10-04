import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { queryKeys } from "@/share/config/queryKeys";
import { getMyComments } from "../api/myCommentsApi";

export function useMyComments(page: number) {
  return useQuery({
    queryKey: queryKeys.myComments.list(page),
    queryFn: () => getMyComments(page),
    placeholderData: keepPreviousData,
  });
}

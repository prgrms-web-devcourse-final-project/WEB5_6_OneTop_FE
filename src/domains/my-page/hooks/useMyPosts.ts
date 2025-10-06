import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { queryKeys } from "@/share/config/queryKeys";
import { getMyPosts } from "../api/myPostsApi";

export function useMyPosts(page: number) {
  return useQuery({
    queryKey: queryKeys.myPosts.list(page),
    queryFn: () => getMyPosts(page),
    placeholderData: keepPreviousData,
  });
}

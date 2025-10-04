import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/share/config/queryKeys";
import { getMyInfo, putMyInfo } from "../api/myInfoApi";

export function useMyInfo() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.myInfo.get(),
    queryFn: getMyInfo,
  });

  const mutation = useMutation({
    mutationFn: putMyInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myInfo.get() });
    },
  });

  return { query, mutation };
}

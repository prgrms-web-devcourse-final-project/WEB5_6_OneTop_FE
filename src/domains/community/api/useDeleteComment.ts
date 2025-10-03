import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/share/config/api";
import { getApiBaseUrl } from "@/share/config/api";
import { queryKeys } from "@/share/config/queryKeys";
import { useRouter } from "next/navigation";

export function useDeleteComment() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ["comment", "delete"],
    mutationFn: ({ id }: { id: string }) =>
      api.delete(`${getApiBaseUrl()}/api/v1/posts/${id}/comments/${id}`),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comment.get(id) });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

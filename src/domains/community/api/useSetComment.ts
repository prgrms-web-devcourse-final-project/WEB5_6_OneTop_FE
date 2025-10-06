import { api, getApiBaseUrl } from "@/share/config/api";
import { queryKeys } from "@/share/config/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface SetCommentProps {
  content: string;
  hide: boolean;
  id: string;
}

export function useSetComment() {
  const queryClient = useQueryClient();
  const baseUrl = getApiBaseUrl();
  const router = useRouter();

  return useMutation({
    mutationKey: ["comment", "set"],
    mutationFn: ({ content, hide, id }: SetCommentProps) =>
      api.post(`${baseUrl}/api/v1/posts/${id}/comments`, { content, hide }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comment.get(id) });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

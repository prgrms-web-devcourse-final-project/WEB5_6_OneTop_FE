import { api } from "@/share/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      Swal.fire({
        title: "게시글이 삭제되었습니다.",
        icon: "success",
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
}

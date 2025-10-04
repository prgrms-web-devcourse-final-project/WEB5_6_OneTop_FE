import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/share/config/queryKeys";
import {
  getRepresentativeProfile,
  putRepresentativeProfile,
} from "../api/representativeProfileApi";

export function useRepresentativeProfile() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.representativeProfile.get(),
    queryFn: getRepresentativeProfile,
  });

  const mutation = useMutation({
    mutationFn: putRepresentativeProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.representativeProfile.get(),
      });
    },
  });

  return { query, mutation };
}

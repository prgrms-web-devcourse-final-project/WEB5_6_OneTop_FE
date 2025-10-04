import { api } from "@/share/config/api";
import { ScenarioListResponse } from "../type";

export const getMyScenarios = async (
  page: number,
  size: number = 10,
  sort: string = "createdDate,desc"
): Promise<ScenarioListResponse> => {
  const { data } = await api.get("/api/v1/users/list", {
    params: {
      page,
      size,
      sort,
    },
  });
  return data;
};

import { api } from "@/share/config/api";
import { BaselineListResponse } from "../types";

export const getBaselines = async (
  page: number,
  size: number
): Promise<BaselineListResponse> => {
  const response = await api.get(`/api/v1/scenarios/baselines`, {
    params: { page, size, sort: "createdDate,desc" },
  });
  return response.data;
};

// 임시 api, 실제 api로 변경 필요
export const deleteBaseline = async (baselineId: number): Promise<void> => {
  await api.delete(`/api/v1/baselines/${baselineId}`);
};

import { api } from "@/share/config/api";
import { ScenarioCompareResponse, TimelineResponse } from "../types";
import { AxiosError } from "axios";

export const clientCompareApi = {
  compareScenarios: async (
    baseId: number,
    compareId: number
  ): Promise<ScenarioCompareResponse> => {
    try {
      console.log("시나리오 비교:", { baseId, compareId });

      const response = await api.get<ScenarioCompareResponse>(
        `/api/v1/scenarios/compare/${baseId}/${compareId}`
      );

      console.log("시나리오 비교 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("시나리오 비교 실패:", error);

      if (error instanceof AxiosError && error.response) {
        console.error("에러 응답:", error.response.data);
      }

      throw error;
    }
  },

  getScenarioTimeline: async (
    scenarioId: number
  ): Promise<TimelineResponse> => {
    try {
      console.log("타임라인 조회:", { scenarioId });

      const response = await api.get<TimelineResponse>(
        `/api/v1/scenarios/${scenarioId}/timeline`
      );

      console.log("타임라인 조회 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("타임라인 조회 실패:", error);

      if (error instanceof AxiosError && error.response) {
        console.error("에러 응답:", error.response.data);
      }

      throw error;
    }
  },
};

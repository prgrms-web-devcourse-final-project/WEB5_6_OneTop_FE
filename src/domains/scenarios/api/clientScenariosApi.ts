import { api } from "@/share/config/api";
import { AxiosError } from "axios";
import {
  CreateScenarioResponse,
  DecisionLineResponse,
  ScenarioData,
  ScenarioInfoResponse,
  ScenarioStatusResponse,
  TimelineItem,
  TimelineResponse,
} from "../types";

export const clientScenariosApi = {
  // DecisionLine 생성
  createDecisionLine: async (
    userId: number,
    baseLineId: number,
    pivotOrd: number, // index 사용
    selectedAltIndex: number // 0 또는 1
  ): Promise<DecisionLineResponse> => {
    try {
      console.log("DecisionLine 생성:", {
        userId,
        baseLineId,
        pivotOrd,
        selectedAltIndex,
      });

      const response = await api.post<DecisionLineResponse>(
        "/api/v1/decision-flow/from-base",
        {
          userId,
          baseLineId,
          pivotOrd,
          selectedAltIndex,
          category: null,
          situation: null,
          options: null,
          selectedIndex: null,
          description: null,
        }
      );

      console.log("DecisionLine 생성 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("DecisionLine 생성 실패:", error);

      if (error instanceof AxiosError && error.response) {
        console.error("에러 응답:", error.response.data);
      }

      throw error;
    }
  },

  // Scenario 생성
  createScenario: async (
    decisionLineId: number
  ): Promise<CreateScenarioResponse> => {
    try {
      console.log("시나리오 생성:", { decisionLineId });

      const response = await api.post<CreateScenarioResponse>(
        "/api/v1/scenarios",
        { decisionLineId }
      );

      console.log("시나리오 생성 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("시나리오 생성 실패:", error);

      if (error instanceof AxiosError && error.response) {
        console.error("에러 응답:", error.response.data);
      }

      throw error;
    }
  },

  // 상태 조회
  getScenarioStatus: async (
    scenarioId: number
  ): Promise<ScenarioStatusResponse> => {
    try {
      const response = await api.get<ScenarioStatusResponse>(
        `/api/v1/scenarios/${scenarioId}/status`
      );
      return response.data;
    } catch (error) {
      console.error("시나리오 상태 조회 실패:", error);
      throw error;
    }
  },

  // 상세 정보 조회
  getScenarioInfo: async (
    scenarioId: number
  ): Promise<ScenarioInfoResponse> => {
    try {
      const response = await api.get<ScenarioInfoResponse>(
        `/api/v1/scenarios/info/${scenarioId}`
      );
      return response.data;
    } catch (error) {
      console.error("시나리오 정보 조회 실패:", error);
      throw error;
    }
  },

  // 타임라인 조회 (백엔드 응답에 맞춤)
  getScenarioTimeline: async (scenarioId: number): Promise<TimelineItem[]> => {
    try {
      const url = `/api/v1/scenarios/${scenarioId}/timeline`;
      console.log("요청 URL:", url);
      console.log("Base URL:", api.defaults.baseURL);
      console.log("Full URL:", `${api.defaults.baseURL}${url}`);

      const response = await api.get<TimelineResponse>(url);
      return response.data.events;
    } catch (error) {
      console.error("타임라인 조회 실패:", error);
      if (error instanceof AxiosError) {
        console.error("요청 URL:", error.config?.url);
        console.error("응답 상태:", error.response?.status);
        console.error("응답 데이터:", error.response?.data);
      }
      throw error;
    }
  },

  // 통합 데이터 조회
  getScenarioData: async (scenarioId: number): Promise<ScenarioData> => {
    try {
      const [info, timeline] = await Promise.all([
        clientScenariosApi.getScenarioInfo(scenarioId),
        clientScenariosApi.getScenarioTimeline(scenarioId),
      ]);

      // 안전한 조회 함수
      const findIndicator = (type: string) =>
        info.indicators.find((i) => i.type === type);

      return {
        analysis: {
          economy: findIndicator("경제")?.analysis || "데이터 없음",
          health: findIndicator("건강")?.analysis || "데이터 없음",
          relationships: findIndicator("관계")?.analysis || "데이터 없음",
          jobs: findIndicator("직업")?.analysis || "데이터 없음",
          happiness: findIndicator("행복")?.analysis || "데이터 없음",
          aiInsight: info.summary,
        },
        radarData: {
          labels: ["경제", "건강", "관계", "직업", "행복"],
          datasets: [
            {
              label: "현재",
              data: [
                findIndicator("경제")?.point || 0,
                findIndicator("건강")?.point || 0,
                findIndicator("관계")?.point || 0,
                findIndicator("직업")?.point || 0,
                findIndicator("행복")?.point || 0,
              ],
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
            },
          ],
        },
        events: timeline,
      };
    } catch (error) {
      console.error("시나리오 데이터 조회 실패:", error);
      throw error;
    }
  },

  // 피벗 목록 조회
  getPivots: async (baseLineId: number) => {
    try {
      const response = await api.get(`/api/v1/base-lines/${baseLineId}/pivots`);

      // 응답에서 pivots 배열 추출
      return response.data.pivots || [];
    } catch (error) {
      console.error("피벗 목록 조회 실패:", error);
      throw error;
    }
  },
};

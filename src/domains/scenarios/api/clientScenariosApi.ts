import { api } from "@/share/config/api";
import { AxiosError } from "axios";
import { ScenarioData, AnalysisData, RadarData, TimelineItem } from "../types";

// DecisionLine 생성 요청
export interface CreateDecisionLineRequest {
  baseLineId: number;
  pivotNodeId: number;
}

// DecisionLine 응답
export interface DecisionLineResponse {
  decisionLineId: number;
  status: string;
}

// Scenario 생성 요청 (스웨거 기준)
export interface CreateScenarioRequest {
  decisionLineId: number;
}

// Scenario 생성 응답 (스웨거 기준)
export interface CreateScenarioResponse {
  scenarioId: number;
  status: string;
  message: string;
}

// Scenario 상태 응답 (스웨거 기준)
export interface ScenarioStatusResponse {
  scenarioId: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  message: string;
}

// Scenario 정보 응답 (스웨거 기준)
export interface ScenarioInfoResponse {
  scenarioId: number;
  status: string;
  job: string;
  total: number;
  summary: string;
  description: string;
  img: string;
  createdDate: string;
  indicators: Array<{
    type: string;
    point: number;
    analysis: string;
  }>;
}

// Timeline 응답 (스웨거 기준)
export interface TimelineResponse {
  scenarioId: number;
  events: string; // JSON string
}

export const clientScenariosApi = {
  // 1. DecisionLine 생성
  createDecisionLine: async (
    baseLineId: number,
    pivotNodeId: number
  ): Promise<DecisionLineResponse> => {
    try {
      console.log("🚀 DecisionLine 생성:", { baseLineId, pivotNodeId });

      const response = await api.post<DecisionLineResponse>(
        "/api/v1/decision-flow/from-base",
        { baseLineId, pivotNodeId }
      );

      console.log("✅ DecisionLine 생성 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ DecisionLine 생성 실패:", error);

      if (error instanceof AxiosError && error.response) {
        console.error("📋 에러 응답:", error.response.data);
      }

      throw error;
    }
  },

  // 2. Scenario 생성 (스웨거 기준)
  createScenario: async (
    decisionLineId: number
  ): Promise<CreateScenarioResponse> => {
    try {
      console.log("🚀 시나리오 생성:", { decisionLineId });

      const response = await api.post<CreateScenarioResponse>(
        "/api/v1/scenarios",
        { decisionLineId }
      );

      console.log("✅ 시나리오 생성 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ 시나리오 생성 실패:", error);

      if (error instanceof AxiosError && error.response) {
        console.error("📋 에러 응답:", error.response.data);
      }

      throw error;
    }
  },

  // 3. 상태 조회 (스웨거 기준)
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

  // 4. 상세 정보 조회 (스웨거 기준)
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

  // 5. 타임라인 조회 (스웨거 기준)
  getScenarioTimeline: async (scenarioId: number): Promise<TimelineItem[]> => {
    try {
      const response = await api.get<TimelineResponse>(
        `/api/v1/scenarios/${scenarioId}/timeline`
      );

      // events는 JSON string이므로 파싱 필요
      const events = JSON.parse(response.data.events);
      return events;
    } catch (error) {
      console.error("타임라인 조회 실패:", error);
      throw error;
    }
  },

  // 6. 통합 데이터 조회 (프론트엔드용 헬퍼)
  getScenarioData: async (scenarioId: number): Promise<ScenarioData> => {
    try {
      const [info, timeline] = await Promise.all([
        clientScenariosApi.getScenarioInfo(scenarioId),
        clientScenariosApi.getScenarioTimeline(scenarioId),
      ]);

      // 스웨거 응답을 프론트엔드 타입으로 변환
      return {
        analysis: {
          economy:
            info.indicators.find((i) => i.type === "경제")?.analysis || "",
          health:
            info.indicators.find((i) => i.type === "건강")?.analysis || "",
          relationships:
            info.indicators.find((i) => i.type === "관계")?.analysis || "",
          jobs: info.indicators.find((i) => i.type === "직업")?.analysis || "",
          happiness:
            info.indicators.find((i) => i.type === "행복")?.analysis || "",
          aiInsight: info.summary,
        },
        radarData: {
          labels: ["경제", "건강", "관계", "직업", "행복"],
          datasets: [
            {
              label: "현재",
              data: [
                info.indicators.find((i) => i.type === "경제")?.point || 0,
                info.indicators.find((i) => i.type === "건강")?.point || 0,
                info.indicators.find((i) => i.type === "관계")?.point || 0,
                info.indicators.find((i) => i.type === "직업")?.point || 0,
                info.indicators.find((i) => i.type === "행복")?.point || 0,
              ],
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
            },
          ],
        },
        timeline: timeline,
      };
    } catch (error) {
      console.error("시나리오 데이터 조회 실패:", error);
      throw error;
    }
  },

  // 7. 피벗 목록 조회 (DecisionLine 생성에 필요)
  getPivots: async (baseLineId: number) => {
    try {
      const response = await api.get(`/api/v1/base-lines/${baseLineId}/pivots`);
      return response.data;
    } catch (error) {
      console.error("피벗 목록 조회 실패:", error);
      throw error;
    }
  },
};

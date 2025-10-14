import {
  TreeData,
  DecisionNode,
  CreateNodeRequest,
  CreateNodeNextRequest,
  ScenarioRequest,
} from "@/domains/multiverse/types";
import { api, getApiBaseUrl } from "@/share/config/api";
import { nextFetcher } from "@/share/utils/nextFetcher";

// 트리 조회
export async function getTreeData(baselineId: number): Promise<TreeData> {
  const response = await api.get(`/api/v1/base-lines/${baselineId}/tree`);
  return response.data;
}

// endpoint 및 body 구분
const getEndpointAndBody = (
  data: CreateNodeRequest
): {
  endpoint: string;
  body: Omit<CreateNodeRequest, "isBaseline" | "isFork">;
} => {
  if ("isBaseline" in data && data.isBaseline) {
    const { isBaseline, ...rest } = data;
    return { endpoint: "/api/v1/decision-flow/from-base", body: rest };
  }

  if ("isFork" in data && data.isFork) {
    const { isFork, ...rest } = data;
    return { endpoint: "/api/v1/decision-flow/fork", body: rest };
  }

  const { isBaseline, ...rest } = data as CreateNodeNextRequest;
  return { endpoint: "/api/v1/decision-flow/next", body: rest };
};

// 선택지 입력
export async function createDecisionNode(
  data: CreateNodeRequest
): Promise<DecisionNode[]> {
  const { endpoint, body } = getEndpointAndBody(data);
  const response = await api.post<DecisionNode | DecisionNode[]>(
    endpoint,
    body
  );
  return Array.isArray(response.data) ? response.data : [response.data];
}

// 시나리오 생성
export async function createScenarioWithDecision(
  data: ScenarioRequest
): Promise<{ scenarioId: number; status: string; message: string }> {
  const formData = new FormData();

  formData.append(
    "scenario",
    new Blob([JSON.stringify(data.scenario)], { type: "application/json" })
  );
  formData.append(
    "lastDecision",
    new Blob([JSON.stringify(data.lastDecision)], { type: "application/json" })
  );

  const response = await api.post("/api/v1/scenarios", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

// decisionLineId로 ScenarioId 조회
export async function getScenarioByDecisionLine(
  decisionLineId: number
): Promise<{ scenarioId: number; baseScenarioId: number }> {
  try {
    const response = await api.get<{
      scenarioId: number;
      baseScenarioId: number;
    }>(`/api/v1/scenarios/by-decision-line/${decisionLineId}`);

    return response.data;
  } catch (error) {
    console.error("시나리오 아이디 조회 실패:", error);
    throw error;
  }
}

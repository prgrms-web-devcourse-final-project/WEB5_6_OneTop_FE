import { axiosInstance } from "@/share/utils/axios";
import {
  LifeEvent,
  BaseNodeDto,
  BaseLineBulkCreateRequest,
  BaseLineBulkCreateResponse,
  categoryToBackend,
  categoryToFrontend,
  BaseLineListItemDto,
  ApiResponse,
} from "../types";

// BaseNodeDto → LifeEvent 변환
const convertNodeToEvent = (node: BaseNodeDto): LifeEvent => {
  return {
    id: node.id.toString(),
    year: 0, // 사용자 생년월일 기반 계산 필요 (추후 보완)
    age: node.ageYear,
    category: categoryToFrontend[node.category],
    eventTitle: node.situation,
    actualChoice: node.decision,
    context: node.description || "",
    createdAt: new Date(),
    baseLineId: node.baseLineId,
    title: node.title,
  };
};

export const clientBaselineApi = {
  // 베이스라인 일괄 생성
  createBaseLine: async (
    events: Array<{
      year: number;
      age: number;
      category: LifeEvent["category"];
      eventTitle: string;
      actualChoice: string;
      context?: string;
    }>,
    title?: string,
    userId: number = 1
  ): Promise<LifeEvent[]> => {
    try {
      console.log("베이스라인 생성 시작:", { events, title, userId });

      const request: BaseLineBulkCreateRequest = {
        userId,
        title: title || "",
        nodes: events.map((event) => ({
          category: categoryToBackend[event.category],
          situation: event.eventTitle,
          decision: event.actualChoice,
          ageYear: event.age,
        })),
      };

      console.log("백엔드 요청 데이터:", request);

      const response = await axiosInstance.post<BaseLineBulkCreateResponse>(
        "/base-lines/bulk",
        request
      );

      console.log("백엔드 응답:", response.data);

      if (response.data && response.data.baseLineId) {
        const nodes = await clientBaselineApi.getBaseLineNodes(
          response.data.baseLineId
        );
        console.log("조회된 노드들:", nodes);
        return nodes;
      }

      throw new Error("베이스라인 응답에서 baseLineId를 찾을 수 없습니다");
    } catch (error) {
      console.error("베이스라인 생성 실패:", error);
      throw error;
    }
  },

  // 특정 베이스라인의 노드 목록 조회
  getBaseLineNodes: async (baseLineId: number): Promise<LifeEvent[]> => {
    try {
      const response = await axiosInstance.get<BaseNodeDto[]>(
        `/base-lines/${baseLineId}/nodes`
      );

      if (Array.isArray(response.data)) {
        return response.data.map(convertNodeToEvent);
      }
      return [];
    } catch (error) {
      console.error("베이스라인 노드 조회 실패:", error);
      throw new Error("베이스라인 노드를 불러오는데 실패했습니다.");
    }
  },

  // 사용자의 첫 번째 베이스라인 조회
  getBaseLine: async (userId: number = 1): Promise<LifeEvent[]> => {
    try {
      // 현재는 임시로 baseLineId 1을 사용
      const baseLineId = 1; // 실제로는 사용자의 첫 번째 베이스라인 ID를 가져와야 함
      return await clientBaselineApi.getBaseLineNodes(baseLineId);
    } catch (error) {
      console.error("베이스라인 조회 실패:", error);
      return [];
    }
  },

  // 단일 노드 조회
  getNode: async (nodeId: number): Promise<LifeEvent> => {
    try {
      const response = await axiosInstance.get<BaseNodeDto>(
        `/base-lines/nodes/${nodeId}`
      );

      if (response.data) {
        return convertNodeToEvent(response.data);
      }
      throw new Error("노드 조회 실패");
    } catch (error) {
      console.error("노드 조회 실패:", error);
      throw new Error("분기점을 불러오는데 실패했습니다.");
    }
  },

  // 사용자의 베이스라인 목록 조회
  getBaseLineList: async (): Promise<
    Array<{
      id: number;
      title: string;
      tags: string[];
      createdAt: string;
    }>
  > => {
    try {
      const response = await axiosInstance.get<
        ApiResponse<BaseLineListItemDto[]>
      >("scenarios/baselines");

      console.log("베이스라인 목록 조회:", response.data);

      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data.map((item) => ({
          id: item.baselineId,
          title: item.title,
          tags: item.tags,
          createdAt: item.createdDate,
        }));
      }

      return [];
    } catch (error) {
      console.error("베이스라인 목록 조회 실패:", error);
      return [];
    }
  },
};

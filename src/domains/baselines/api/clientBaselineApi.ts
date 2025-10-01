import { api } from "@/share/config/api";
import {
  LifeEvent,
  BaseNodeDto,
  BaseLineBulkCreateRequest,
  BaseLineBulkCreateResponse,
  categoryToBackend,
  categoryToFrontend,
  BaseLineListItemDto,
  BaselineListResponse,
} from "../types";

const convertNodeToEvent = (node: BaseNodeDto): LifeEvent => {
  return {
    id: node.id.toString(),
    year: 0,
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
  ): Promise<{ baseLineId: number; events: LifeEvent[] }> => {
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

      const response = await api.post<BaseLineBulkCreateResponse>(
        "/api/v1/base-lines/bulk",
        request
      );

      console.log("백엔드 응답:", response.data);

      if (response.data && response.data.baseLineId) {
        const nodes = await clientBaselineApi.getBaseLineNodes(
          response.data.baseLineId
        );

        // baseLineId를 각 노드에 추가
        const eventsWithBaseLineId = nodes.map((node) => ({
          ...node,
          baseLineId: response.data.baseLineId,
        }));

        console.log("조회된 노드들:", eventsWithBaseLineId);

        return {
          baseLineId: response.data.baseLineId,
          events: eventsWithBaseLineId,
        };
      }

      throw new Error("베이스라인 응답에서 baseLineId를 찾을 수 없습니다");
    } catch (error) {
      console.error("베이스라인 생성 실패:", error);
      throw error;
    }
  },

  getBaseLineNodes: async (baseLineId: number): Promise<LifeEvent[]> => {
    try {
      const response = await api.get<BaseNodeDto[]>(
        `/api/v1/base-lines/${baseLineId}/nodes`
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

  getBaseLineList: async (): Promise<
    Array<{
      id: number;
      title: string;
      tags?: string[];
      createdAt: string;
    }>
  > => {
    try {
      const response = await api.get<BaselineListResponse>("/scenario-list");

      console.log("베이스라인 목록 조회:", response.data);

      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data.map((item: BaseLineListItemDto) => ({
          id: item.baselineId,
          title: item.title || `베이스라인 ${item.baselineId}`,
          tags: item.tags || [],
          createdAt: item.createdDate,
        }));
      }

      return [];
    } catch (error) {
      console.error("베이스라인 목록 조회 실패:", error);
      return [];
    }
  },
  getBaseLine: async (): Promise<LifeEvent[]> => {
    try {
      const baseLineId = 1;
      return await clientBaselineApi.getBaseLineNodes(baseLineId);
    } catch (error) {
      console.error("베이스라인 조회 실패:", error);
      return [];
    }
  },

  getNode: async (nodeId: number): Promise<LifeEvent> => {
    try {
      const response = await api.get<BaseNodeDto>(
        `/api/v1/base-lines/nodes/${nodeId}`
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
};

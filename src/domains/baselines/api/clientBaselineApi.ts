import { api } from "@/share/config/api";
import {
  LifeEvent,
  BaseNodeDto,
  BaseLineBulkCreateRequest,
  BaseLineBulkCreateResponse,
  NodeCategory,
} from "../types";

// 카테고리 매핑
const categoryMapping: Record<string, NodeCategory> = {
  교육: NodeCategory.EDUCATION,
  직업: NodeCategory.CAREER,
  관계: NodeCategory.RELATIONSHIP,
  경제: NodeCategory.FINANCE,
  건강: NodeCategory.HEALTH,
  행복: NodeCategory.HAPPINESS,
  기타: NodeCategory.ETC,
};

const reverseCategoryMapping: Record<NodeCategory, LifeEvent["category"]> = {
  [NodeCategory.EDUCATION]: "교육",
  [NodeCategory.CAREER]: "직업",
  [NodeCategory.RELATIONSHIP]: "관계",
  [NodeCategory.FINANCE]: "경제",
  [NodeCategory.HEALTH]: "건강",
  [NodeCategory.HAPPINESS]: "행복",
  [NodeCategory.ETC]: "기타",
};

const convertNodeToEvent = (node: BaseNodeDto): LifeEvent => {
  return {
    id: node.id.toString(),
    year: new Date().getFullYear() - (25 - node.ageYear), // 임시 계산
    age: node.ageYear,
    category: reverseCategoryMapping[node.category] || "기타",
    eventTitle: node.situation,
    actualChoice: node.decision,
    context: "",
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
      category: string;
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
          category: categoryMapping[event.category] || NodeCategory.ETC,
          situation: event.eventTitle,
          decision: event.actualChoice,
          ageYear: event.age,
        })),
      };

      console.log("백엔드 요청 데이터:", request);

      const response: BaseLineBulkCreateResponse = await api.post(
        "/api/v1/base-lines/bulk",
        request
      );

      console.log("백엔드 응답:", response);

      if (response && response.baseLineId) {
        const nodes = await clientBaselineApi.getBaseLineNodes(
          response.baseLineId
        );
        console.log("조회된 노드들:", nodes);
        return nodes;
      }
      throw new Error("베이스라인 응답에서 baseLineId를 찾을 수 없습니다");
    } catch (error) {
      console.error("베이스라인 생성 상세 에러:", error);
      throw new Error(`베이스라인 생성에 실패했습니다: ${error}`);
    }
  },

  // 특정 베이스라인의 노드 목록 조회
  getBaseLineNodes: async (baseLineId: number): Promise<LifeEvent[]> => {
    try {
      const response: BaseNodeDto[] = await api.get(
        `/api/v1/base-lines/${baseLineId}/nodes`
      );

      if (Array.isArray(response)) {
        return response.map(convertNodeToEvent);
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
      // 실제로는 사용자의 베이스라인 목록을 먼저 조회해야 함
      // 현재는 임시로 baseLineId 1을 사용
      const baseLineId = 1; // 실제로는 사용자의 첫 번째 베이스라인 ID를 가져와야 함

      return await clientBaselineApi.getBaseLineNodes(baseLineId);
    } catch (error) {
      console.error("베이스라인 조회 실패:", error);
      // 베이스라인이 없는 경우 빈 배열 반환
      return [];
    }
  },

  // 단일 노드 조회
  getNode: async (nodeId: number): Promise<LifeEvent> => {
    try {
      const response: BaseNodeDto = await api.get(
        `/api/v1/base-lines/nodes/${nodeId}`
      );

      if (response) {
        return convertNodeToEvent(response);
      }
      throw new Error("노드 조회 실패");
    } catch (error) {
      console.error("노드 조회 실패:", error);
      throw new Error("분기점을 불러오는데 실패했습니다.");
    }
  },
};
